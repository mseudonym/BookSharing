using BS.Core.Extensions;
using BS.Core.Models.Items;
using BS.Core.Models.Mapping;
using BS.Core.Models.Queue;
using BS.Core.Services.Queue;
using BS.Core.Services.User;
using BS.Data.Context;
using BS.Data.Entities;
using FluentResults;
using Microsoft.EntityFrameworkCore;

namespace BS.Core.Services.Items;

public class ItemService : IItemService
{
    private readonly BookSharingContext _dbContext;
    private readonly ICurrentUserService _currentUserService;
    private readonly BookMapper _bookMapper;
    private readonly IQueueService _queueService;


    public ItemService(BookSharingContext dbContext, ICurrentUserService currentUserService, IQueueService queueService,
        BookMapper bookMapper)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
        _bookMapper = bookMapper;
        _queueService = queueService;
    }

    public async Task<Result<MyItemInfo[]>> GetMyItemsWithHolderAsync()
    {
        var currentUserId = await _currentUserService.GetIdAsync();
        var currentUser = await _dbContext.Users
            .Where(user => user.Id == currentUserId)
            .Include(user => user.Items)
            .ThenInclude(item => item.Book)
            .FirstAsync();

        var itemsWithHolder = currentUser.Items
            .Where(item => item.HolderId != currentUserId);

        return itemsWithHolder.Select(item =>
                new MyItemInfo
                {
                    ItemId = item.Id,
                    Book = _bookMapper.ToBookModel(item.Book),
                    CurrentHolderId = item.HolderId,
                    CurrentHolderContact = GetUserContact(item.HolderId)
                })
            .ToArray();
    }

    public async Task<Result<FriendItemInfo[]>> GetItemsCurrentUserHoldAsync()
    {
        var currentUserId = await _currentUserService.GetIdAsync();

        var queueItemsImInQueue = await _dbContext.QueueItems
            .Where(queueItem => queueItem.UserId == currentUserId)
            .ToArrayAsync();

        var resultFromQueues = queueItemsImInQueue
            .Select(GetItemUserCurrentlyHoldOrInQueue)
            .ToArray();

        var itemsIHold = await _dbContext.Items
            .Where(item => item.HolderId == currentUserId && item.OwnerId != currentUserId)
            .Include(item => item.Book)
            .ToArrayAsync();

        var resultFromItemsIHold = itemsIHold
            .Select(GetItemUserCurrentlyHoldOrInQueue)
            .ToArray();

        return await resultFromQueues.Concat(resultFromItemsIHold).WhenAllAsync();
    }

    public async Task<Result<QueueModel[]>> GetAllQueuesOfBook(Guid bookId)
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

        var queuesInItems = allFriendsItemsWithThisBook
            .Select(item => _queueService.GetQueueAsync(item.Id).GetAwaiter().GetResult().Value)
            .ToArray();

        return queuesInItems;
    }

    public async Task<Result> AddToMyShelf(Guid bookId)
    {
        var currentUserId = await _currentUserService.GetIdAsync();

        await _dbContext.Items.AddAsync(
            new ItemEntity
            {
                Id = Guid.NewGuid(),
                BookId = bookId,
                OwnerId = currentUserId,
                HolderId = currentUserId,
                CreatedUtc = DateTime.UtcNow,
            }
        );

        await _dbContext.SaveChangesAsync();
        
        return Result.Ok();
    }

    private string GetUserContact(Guid? id)
    {
        if (id == null)
            return "";
        var user = _dbContext.Users.Find(id);
        if (user == null)
            return "";
        return user.ContactUrl ?? "";
    }

    private async Task<FriendItemInfo> GetItemUserCurrentlyHoldOrInQueue(QueueItemEntity queueItem)
    {
        var item = await _dbContext.Items
            .Include(itemEntity => itemEntity.Book)
            .FirstAsync(item => item.Id == queueItem.ItemId);

        var bookModel = _bookMapper.ToBookModel(item.Book);

        var queue = await _dbContext
            .QueueItems
            .Where(qi => qi.ItemId == queueItem.ItemId)
            .OrderBy(qi => qi.EnqueueTimeUtc)
            .ToArrayAsync();
        var queueNumber = Array.FindIndex(queue, itemInQueue => itemInQueue.UserId == queueItem.UserId) + 1;

        var holder = await _dbContext.Users.FindAsync(item.HolderId);
        return new FriendItemInfo
        {
            Book = bookModel,
            AmIHolder = false,
            HolderContact = queueNumber == 1 ? holder?.ContactUrl ?? "" : "",
            HolderUsername = queueNumber == 1 ? holder?.UserName ?? "" : "",
            ItemId = queueItem.ItemId,
            OwnerId = item.OwnerId,
            QueueNumber = queueNumber,
            WhoToGiveAfterContact = null,
        };
    }

    private async Task<FriendItemInfo> GetItemUserCurrentlyHoldOrInQueue(ItemEntity queueItem)
    {
        var firstInQueue = await _dbContext
            .QueueItems
            .Where(qi => qi.ItemId == queueItem.Id)
            .OrderBy(qi => qi.EnqueueTimeUtc)
            .FirstOrDefaultAsync();
        var whoToGiveAfter = await _dbContext.Users.FindAsync(firstInQueue?.UserId);
        return new FriendItemInfo
        {
            Book = _bookMapper.ToBookModel(queueItem.Book),
            AmIHolder = true,
            HolderContact = null,
            HolderUsername = null,
            ItemId = queueItem.Id,
            OwnerId = queueItem.OwnerId,
            QueueNumber = 0,
            WhoToGiveAfterContact = whoToGiveAfter?.ContactUrl ?? "",
            WhoToGiveAfterUserName = whoToGiveAfter?.UserName ?? ""
        };
    }
}