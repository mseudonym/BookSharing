using BS.Core.Models.Items;
using BS.Core.Models.Mapping;
using BS.Core.Models.Queue;
using BS.Core.Models.User;
using BS.Core.Services.User;
using BS.Data.Context;
using BS.Data.Entities;
using FluentResults;
using Microsoft.EntityFrameworkCore;

namespace BS.Core.Services.Items;

public class ItemService : IItemService
{
    private readonly BookMapper _bookMapper;
    private readonly ICurrentUserService _currentUserService;
    private readonly BookSharingContext _dbContext;
    private readonly UserMapper _userMapper;
    private readonly TimeProvider _timeProvider;

    public ItemService(
        BookSharingContext dbContext,
        ICurrentUserService currentUserService,
        BookMapper bookMapper,
        UserMapper userMapper,
        TimeProvider timeProvider)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
        _bookMapper = bookMapper;
        _userMapper = userMapper;
        _timeProvider = timeProvider;
    }

    public async Task<Result<ItemModel>> GetItemAsync(Guid itemId)
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
        
        return Result.Ok(items.Select(item => ToFriendItemModel(item, currentUserId)).ToArray());
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

        var itemEntity = new ItemEntity
        {
            Id = Guid.NewGuid(),
            BookId = bookId,
            OwnerId = currentUserId,
            HolderId = currentUserId,
            CreatedUtc = _timeProvider.GetUtcNow().DateTime,
            HolderChangedUtc = _timeProvider.GetUtcNow().DateTime,
        };
        await _dbContext.Items.AddAsync(itemEntity);

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

    private static List<UserEntity> GetQueue(ItemEntity item)
    {
        var queue = item.QueueItems
            .OrderByDescending(queueItem => queueItem.IsForcedFirstByOwner)
            .Select(queueItem => queueItem.User)
            .ToList();
        return queue;
    }
}