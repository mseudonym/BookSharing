using BS.Core.Errors;
using BS.Core.Models.Items;
using BS.Core.Models.Mapping;
using BS.Core.Options;
using BS.Core.Services.User;
using BS.Data.Context;
using BS.Data.Entities;
using BS.Data.Entities.Notifications.Friendship;
using BS.Data.Entities.Notifications.FriendUpdate;
using BS.Data.Entities.Notifications.Items;
using FluentResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace BS.Core.Services.Items;

public class ItemService : IItemService
{
    private readonly BookMapper _bookMapper;
    private readonly ICurrentUserService _currentUserService;
    private readonly BookSharingContext _dbContext;
    private readonly UserMapper _userMapper;
    private readonly TimeProvider _timeProvider;
    private readonly NotificationOptions _notificationOptions;

    public ItemService(
        BookSharingContext dbContext,
        ICurrentUserService currentUserService,
        BookMapper bookMapper,
        UserMapper userMapper,
        TimeProvider timeProvider,
        IOptions<NotificationOptions> notificationOptions)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
        _bookMapper = bookMapper;
        _userMapper = userMapper;
        _timeProvider = timeProvider;
        _notificationOptions = notificationOptions.Value;
    }

    private async Task<Result<ItemModel>> GetItemAsync(Guid itemId)
    {
        //TODO: Проверять на то, что мы в друзьях у держателя
        var item = await _dbContext.Items.FindAsync(itemId);
        if (item == null) return Result.Fail<ItemModel>("Item not found");
        var queueItemEntities = await _dbContext.QueueItems
            .Where(queueItem => queueItem.ItemId == itemId)
            .Include(queueItem => queueItem.User)
            .OrderBy(queueItem => queueItem.EnqueueTimeUtc)
            .ToArrayAsync();

        var queue = queueItemEntities
            .OrderByDescending(queueItem => queueItem.IsForcedFirstByOwner)
            .Select(queueItem => queueItem.User)
            .ToList();

        var owner = await _dbContext.Users.FirstAsync(user => user.Id == item.OwnerId);
        var holder = await _dbContext.Users.FirstAsync(user => user.Id == item.HolderId);

        var currentUserId = await _currentUserService.GetIdAsync();
        var isIAmOwner = currentUserId == owner.Id;
        var isIAmFirst = queue.Count > 0 && currentUserId == queue.First().Id;
        var isIAmHolder = currentUserId == holder.Id;

        var itemModel = new ItemModel
        {
            ItemId = itemId,
            Owner = _userMapper.ToUserProfile(owner, FriendshipStatus.Friend),
            Holder = _userMapper.ToUserProfile(holder, FriendshipStatus.None, isIAmOwner || isIAmFirst),
            Queue = queue.Select(itemEntity => _userMapper.ToQueueUser(itemEntity)).ToArray(),
        };

        if (queue.Count > 0)
        {
            var firstInQueue = queue.First();
            itemModel.FirstInQueue =
                _userMapper.ToUserProfile(firstInQueue, FriendshipStatus.None, isIAmHolder || isIAmOwner);
        }

        return Result.Ok(itemModel);
    }

    public async Task<Result<ItemInfo[]>> GetMyItems()
    {
        var currentUserId = await _currentUserService.GetIdAsync();
        var items = await _dbContext.Items
            .Where(item => item.OwnerId == currentUserId)
            .Include(item => item.Owner)
            .Include(item => item.Holder)
            .Include(item => item.Book)
            .Include(item => item.QueueItems)
            .ThenInclude(queueItem => queueItem.User)
            .ToArrayAsync();
        
        var itemsWithState = items
            .Where(item => item.HolderId != currentUserId || item.QueueItems.Count != 0)
            .ToArray();
        
        return Result.Ok(itemsWithState.Select(item => ToFriendItemModel(item, currentUserId)).ToArray());
    }

    public async Task<Result<ItemInfo[]>> GetFriendsItems()
    {
        var currentUserId = await _currentUserService.GetIdAsync();

        var itemIdsInQueue = _dbContext.QueueItems
            .Where(q => q.UserId == currentUserId)
            .Select(q => q.ItemId);

        var items = await _dbContext.Items
            .Where(item => itemIdsInQueue.Contains(item.Id)
                           || (item.HolderId == currentUserId && item.OwnerId != currentUserId))
            .Include(item => item.Owner)
            .Include(item => item.Holder)
            .Include(item => item.Book)
            .Include(item => item.QueueItems)
            .ThenInclude(queueItem => queueItem.User)
            .ToArrayAsync();

        
        return Result.Ok(items.Select(item => ToFriendItemModel(item, currentUserId)).ToArray());
    }

    public async Task<Result<ItemModel?>> GetMyItemByBook(Guid bookId)
    {
        var currentUserId = await _currentUserService.GetIdAsync();
        var currentUserItem = await _dbContext.Items
            .Where(item => item.BookId == bookId)
            .Where(item => item.OwnerId == currentUserId)
            .FirstOrDefaultAsync();

        if (currentUserItem is null)
            return Result.Ok<ItemModel?>(null);

        var item = await GetItemAsync(currentUserItem.Id);

        return Result.Ok<ItemModel?>(item.Value);
    }

    public async Task<Result<ItemModel[]>> GetFriendItemsByBook(Guid bookId)
    {
        var currentUserId = await _currentUserService.GetIdAsync();
        var currentUser = await _dbContext.Users
            .Where(user => user.Id == currentUserId)
            .Include(user => user.Friends)
            .ThenInclude(friend => friend.Items)
            .FirstAsync();

        var allFriendsItemsWithThisBook = currentUser.Friends
            .SelectMany(friend => friend.Items)
            .Where(item => item.BookId == bookId)
            .ToArray();

        var queuesInItems = await Task.WhenAll(
            allFriendsItemsWithThisBook.Select(async item => (await GetItemAsync(item.Id)).Value)
        );
        
        return queuesInItems;
    }

    public async Task<Result> AddToMyShelf(Guid bookId)
    {
        var currentUserId = await _currentUserService.GetIdAsync();

        var bookExists = await _dbContext.Books.AnyAsync(b => b.Id == bookId);
        if (!bookExists)
            return Result.Fail(BookNotFoundError.ById(bookId));

        var itemEntity = new ItemEntity
        {
            BookId = bookId,
            OwnerId = currentUserId,
            HolderId = currentUserId,
            CreatedUtc = _timeProvider.GetUtcNow().UtcDateTime,
            HolderChangedUtc = _timeProvider.GetUtcNow().UtcDateTime,
        };
        await _dbContext.Items.AddAsync(itemEntity);

        // Уведомление всем друзьям о новой книге (батчинг через ShouldBeSentAt)
        var user = await _dbContext.Users
            .Where(u => u.Id == currentUserId)
            .Include(u => u.Friends)
            .FirstAsync();
        var now = _timeProvider.GetUtcNow();
        var batchDelay = TimeSpan.FromMinutes(_notificationOptions.BatchDelayInMinutes);
        foreach (var friend in user.Friends)
        {
            var notification = await _dbContext.Notifications
                .OfType<NewBooksInFriendShelfNotificationEntity>()
                .Where(n =>
                    n.RecipientId == friend.Id &&
                    n.FriendId == user.Id &&
                    n.ShouldBeSentAt != null &&
                    n.ShouldBeSentAt > now)
                .FirstOrDefaultAsync();

            if (notification != null)
            {
                notification.NewBookIds = notification.NewBookIds.Union([bookId]).ToArray();
                notification.ShouldBeSentAt = now.Add(batchDelay).UtcDateTime;
                _dbContext.Notifications.Update(notification);
            }
            else
            {
                _dbContext.Notifications.Add(new NewBooksInFriendShelfNotificationEntity
                {
                    RecipientId = friend.Id,
                    FriendId = user.Id,
                    CreatedAt = now.UtcDateTime,
                    ShouldBeSentAt = now.Add(batchDelay).UtcDateTime,
                    NewBookIds = [bookId],
                });
            }
        }

        await _dbContext.SaveChangesAsync();

        return Result.Ok();
    }

    public async Task<Result> RemoveFromMyShelf(Guid bookId)
    {
        var currentUserId = await _currentUserService.GetIdAsync();

        await _dbContext.Items
            .Where(item => item.BookId == bookId && item.OwnerId == currentUserId)
            .ExecuteDeleteAsync();

        await _dbContext.SaveChangesAsync();

        return Result.Ok();
    }
    
    public async Task<Result> EnqueueAsync(Guid itemId, bool isForcesFirstByOwner = false)
    {
        var currentUserId = await _currentUserService.GetIdAsync();
        var currentUser = await _dbContext.Users
            .Where(user => user.Id == currentUserId)
            .Include(user => user.Friends)
            .FirstAsync();
        
        var item = await _dbContext.Items
            .Where(item => item.Id == itemId)
            .Include(i => i.QueueItems)
            .ThenInclude(q => q.User)
            .FirstOrDefaultAsync();
        if (item is null)
            return Result.Fail(new ItemNotFoundError(itemId));
        
        if (currentUser.Friends.All(friend => friend.Id != item.OwnerId))
            return Result.Fail(new PersonIsNotYourFriendError(item.OwnerId));
        
        if (await _dbContext.QueueItems.AnyAsync(queueItem => queueItem.ItemId == itemId && queueItem.UserId == currentUserId))
            return Result.Fail(new OperationAlreadyApplied("The user is already in the queue"));

        if (isForcesFirstByOwner && !await IsUserOwnsItem(currentUserId, itemId))
            return Result.Fail(new OperationForbiddenError("The user is not owner of this item."));

        await _dbContext.QueueItems.AddAsync(new QueueItemEntity
        {
            UserId = currentUserId,
            ItemId = itemId,
            EnqueueTimeUtc = DateTime.UtcNow,
            IsForcedFirstByOwner = isForcesFirstByOwner,
        });

        // Уведомление владельцу и держателю о новом участнике очереди
        var now = _timeProvider.GetUtcNow().UtcDateTime;
        var newQueueMember = currentUser;
        if (item.OwnerId != currentUserId)
        {
            _dbContext.Notifications.Add(new SomeoneQueueToItemNotificationEntity
            {
                RecipientId = item.OwnerId,
                ItemId = item.Id,
                NewQueueMemberId = newQueueMember.Id,
                CreatedAt = now,
                ShouldBeSentAt = now,
            });
        }
        
        if (item.HolderId != item.OwnerId)
        {
            _dbContext.Notifications.Add(new SomeoneQueueToItemNotificationEntity
            {
                RecipientId = item.HolderId,
                ItemId = item.Id,
                NewQueueMemberId = newQueueMember.Id,
                CreatedAt = now,
                ShouldBeSentAt = now,
            });
        }
        await _dbContext.SaveChangesAsync();
        return Result.Ok();
    }

    public async Task<Result> LeaveQueueAsync(Guid itemId)
    {
        var currentUserId = await _currentUserService.GetIdAsync();
        await _dbContext.QueueItems
            .Where(queueItem => queueItem.ItemId == itemId && queueItem.UserId == currentUserId)
            .ExecuteDeleteAsync();
        return Result.Ok();
    }

    public async Task<Result> BecameHolderAsync(Guid itemId)
    {
        var item = await _dbContext.Items
            .Where(item => item.Id == itemId)
            .Include(item => item.QueueItems)
            .Include(item => item.Owner)
            .Include(item => item.Holder)
            .FirstOrDefaultAsync();
        
        if (item is null)
            return Result.Fail("Item not found");

        var queue = GetQueueItems(item);
        
        var currentUserId = await _currentUserService.GetIdAsync();
        var isCurrentUserFirstInQueue = queue.Count != 0 && queue[0].UserId == currentUserId;
        var isCurrentUserOwner = item.OwnerId == currentUserId;
        
        if (!isCurrentUserFirstInQueue && !isCurrentUserOwner)
            return Result.Fail(new OperationForbiddenError("You are not first in queue or owner of this item."));

        item.HolderId = currentUserId;
        item.HolderChangedUtc = _timeProvider.GetUtcNow().UtcDateTime;
        _dbContext.Items.Update(item);
        if (isCurrentUserFirstInQueue)
        {
            _dbContext.QueueItems.Remove(queue[0]);
        }
        
        var now = _timeProvider.GetUtcNow().UtcDateTime;

        if (!isCurrentUserOwner)
        {
            // Уведомление всем друзьям нового держателя о том, что он взял книгу
            var newHolder = await _dbContext.Users
                .Where(u => u.Id == currentUserId)
                .Include(u => u.Friends)
                .FirstAsync();
            foreach (var friend in newHolder.Friends.Where(f => f.Id != item.OwnerId))
            {
                _dbContext.Notifications.Add(new FriendTakeBookToReadNotificationEntity
                {
                    RecipientId = friend.Id,
                    FriendId = newHolder.Id,
                    BookId = item.BookId,
                    CreatedAt = now,
                    ShouldBeSentAt = now,
                });
            }
            // Уведомление владельцу о том, что кто-то стал держателем его книги
            if (item.OwnerId != currentUserId)
            {
                var owner = item.Owner;
                var newHolderEntity = newHolder;
                _dbContext.Notifications.Add(new SomeoneBecameHolderOfYourItemNotificationEntity
                {
                    RecipientId = owner.Id,
                    ItemId = item.Id,
                    NewHolderId = newHolderEntity.Id,
                    CreatedAt = now,
                    ShouldBeSentAt = now
                });
            }
        }

        // Уведомления о смене позиции в очереди для оставшихся
        for (var i = 0; i < queue.Count; i++)
        {
            var queueUser = queue[i];
            if (queueUser.UserId == currentUserId)
                continue;
            _dbContext.Notifications.Add(new YourQueuePositionChangedNotificationEntity
            {
                RecipientId = queueUser.UserId,
                ItemId = item.Id,
                NewPosition = i + 1,
                CreatedAt = now,
                ShouldBeSentAt = now
            });
        }
        
        await _dbContext.SaveChangesAsync();
        return Result.Ok();
    }

    private async Task<bool> IsUserOwnsItem(Guid userId, Guid itemId)
    {
        var user = await _dbContext.Users
            .Where(user => user.Id == userId)
            .Include(user => user.Items)
            .FirstAsync();

        if (user.Items.Any(item => item.Id == itemId)) return true;

        return false;
    }
    
    private ItemInfo ToFriendItemModel(ItemEntity item, Guid currentUserId)
    {
        var queue = GetQueue(item);
        var firstInQueue = queue.FirstOrDefault();
        int index = queue.FindIndex(user => user.Id == currentUserId);
        int? queuePosition = index >= 0 ? index + 1 : null;

        return new ItemInfo
        {
            ItemId = item.Id,
            Book = _bookMapper.ToBookModel(item.Book),
            Owner = _userMapper.ToUserInItemProfile(item.Owner),
            Holder = _userMapper.ToUserInItemProfile(item.Holder),
            FirstInQueue = firstInQueue is not null
                ? _userMapper.ToUserInItemProfile(firstInQueue)
                : null,
            QueuePosition = queuePosition,
            HolderChangedDaysAgo = (_timeProvider.GetUtcNow().UtcDateTime - item.HolderChangedUtc).Days,
        };
    }

    private static List<QueueItemEntity> GetQueueItems(ItemEntity item) =>
        item.QueueItems
            .OrderByDescending(queueItem => queueItem.IsForcedFirstByOwner)
            .ToList();

    private static List<UserEntity> GetQueue(ItemEntity item) =>
        GetQueueItems(item)
            .Select(queueItem => queueItem.User)
            .ToList();
}