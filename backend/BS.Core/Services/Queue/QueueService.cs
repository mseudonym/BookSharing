using BS.Core.Errors.Queue;
using BS.Core.Models.Mapping;
using BS.Core.Models.Queue;
using BS.Core.Models.User;
using BS.Core.Services.User;
using BS.Data.Context;
using BS.Data.Entities;
using FluentResults;
using Microsoft.EntityFrameworkCore;

namespace BS.Core.Services.Queue;

public class QueueService : IQueueService
{
    private readonly ICurrentUserService _currentUserService;
    private readonly BookSharingContext _dbContext;
    private readonly UserMapper _userMapper;

    public QueueService(
        BookSharingContext dbContext,
        ICurrentUserService currentUserService,
        UserMapper userMapper)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
        _userMapper = userMapper;
    }

    public async Task<Result<QueueModel>> GetQueueAsync(Guid itemId)
    {
        //TODO: Проверять на то, что мы в друзьях у держателя
        var item = await _dbContext.Items.FindAsync(itemId);
        if (item == null) return Result.Fail<QueueModel>("Item not found");
        var queueItemEntities = await GetQueueItemEntitiesAsync(itemId);

        var forcedFirstInQueueByUser = queueItemEntities.FirstOrDefault(queueItem => queueItem.IsForcedFirstByOwner);
        var resultQueue = queueItemEntities
            .Where(itemEntity => !itemEntity.IsForcedFirstByOwner)
            .Select(itemEntity => _userMapper.ToQueueUser(itemEntity.User))
            .ToList();
        if (forcedFirstInQueueByUser != null)
            resultQueue.Insert(0, _userMapper.ToQueueUser(forcedFirstInQueueByUser.User));

        var owner = await _dbContext.Users.FirstAsync(user => user.Id == item.OwnerId);
        var holder = await _dbContext.Users.FirstAsync(user => user.Id == item.HolderId);

        return Result.Ok(new QueueModel
        {
            ItemId = itemId,
            Holder = _userMapper.ToUserProfile(holder, FriendshipStatus.None),
            Owner = _userMapper.ToUserProfile(owner, FriendshipStatus.None),
            Queue = resultQueue,
        });
    }

    public async Task<Result<QueueModel>> EnqueueAsync(Guid itemId, bool isForcesFirstByOwner = false)
    {
        var currentUserId = await _currentUserService.GetIdAsync();
        if (await _dbContext.QueueItems.AnyAsync(item => item.ItemId == itemId && item.UserId == currentUserId))
            return Result.Fail(new UserAlreadyInQueueError("The user is already in the queue"));

        if (isForcesFirstByOwner && !await IsUserOwnsItem(currentUserId, itemId))
            return Result.Fail(new UserDoesNotOwnItemError("The user is not real owner of this item."));

        await _dbContext.QueueItems.AddAsync(new QueueItemEntity
        {
            UserId = currentUserId,
            ItemId = itemId,
            EnqueueTimeUtc = DateTime.UtcNow,
            IsForcedFirstByOwner = isForcesFirstByOwner,
        });

        await _dbContext.SaveChangesAsync();

        return await GetQueueAsync(itemId);
    }

    public async Task<Result> LeaveQueueAsync(Guid itemId)
    {
        var currentUserId = await _currentUserService.GetIdAsync();
        await _dbContext.QueueItems
            .Where(queueItem => queueItem.ItemId == itemId && queueItem.UserId == currentUserId)
            .ExecuteDeleteAsync();
        return Result.Ok();
    }

    public async Task<Result> MakeNextUserTheHolderAsync(Guid itemId)
    {
        var item = await _dbContext.Items.FindAsync(itemId);
        if (item == null) return Result.Fail("Item not found");

        var queueItemEntities = await GetQueueItemEntitiesAsync(itemId);
        if (queueItemEntities.Length == 0) return Result.Fail("Queue is empty");

        var firstInQueue = queueItemEntities.First();
        item.HolderId = firstInQueue.UserId;
        _dbContext.QueueItems.Remove(firstInQueue);
        _dbContext.Items.Update(item);
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

    private async Task<QueueItemEntity[]> GetQueueItemEntitiesAsync(Guid itemId) =>
        await _dbContext.QueueItems
            .Where(queueItem => queueItem.ItemId == itemId)
            .Include(item => item.User)
            .OrderBy(queueItem => queueItem.EnqueueTimeUtc)
            .ToArrayAsync();
}