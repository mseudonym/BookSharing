using BS.Core.Errors;
using BS.Core.Models.Mapping;
using BS.Core.Models.User;
using BS.Core.Services.User;
using BS.Data.Context;
using BS.Data.Entities;
using FluentResults;
using Microsoft.EntityFrameworkCore;

namespace BS.Core.Services.Friends;

public class FriendsService : IFriendsService
{
    private readonly ICurrentUserService _currentUserService;
    private readonly BookSharingContext _dbContext;
    private readonly UserMapper _userMapper;

    public FriendsService(BookSharingContext dbContext, ICurrentUserService currentUserService, UserMapper userMapper)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
        _userMapper = userMapper;
    }

    public async Task<Result<UserProfile[]>> GetFriendsAsync()
    {
        var currentUserId = await _currentUserService.GetIdAsync();
        var currentUser = await _dbContext.Users
            .Where(u => u.Id == currentUserId)
            .Include(u => u.Friends)
            .FirstAsync();

        var friends = currentUser.Friends;
        return Result.Ok(_userMapper.ToUserProfile(friends, FriendshipStatus.Friend));
    }

    public async Task<Result<UserProfile[]>> GetSentFriendRequestsAsync()
    {
        var currentUserId = await _currentUserService.GetIdAsync();
        var currentUser = await _dbContext.Users
            .Where(u => u.Id == currentUserId)
            .Include(u => u.SentFriendRequests)
            .FirstAsync();

        return Result.Ok(_userMapper.ToUserProfile(currentUser.SentFriendRequests, FriendshipStatus.OutcomeRequest));
    }

    public async Task<Result<UserProfile[]>> GetReceivedFriendRequestsAsync()
    {
        var currentUserId = await _currentUserService.GetIdAsync();
        var currentUser = await _dbContext.Users
            .Where(u => u.Id == currentUserId)
            .Include(u => u.ReceivedFriendRequests)
            .FirstAsync();

        return Result.Ok(_userMapper.ToUserProfile(currentUser.ReceivedFriendRequests, FriendshipStatus.IncomeRequest));
    }

    public async Task<Result<UserProfile>> SendFriendRequestAsync(Guid personId)
    {
        var currentUserId = await _currentUserService.GetIdAsync();
        var currentUser = await _dbContext.Users
            .Where(u => u.Id == currentUserId)
            .Include(u => u.Friends)
            .Include(u => u.SentFriendRequests)
            .Include(u => u.ReceivedFriendRequests)
            .FirstAsync();

        if (currentUser.ReceivedFriendRequests.Any(u => u.Id == personId))
            return await RespondToFriendRequestAsync(personId, true);

        if (currentUser.Friends.Any(u => u.Id == personId) || currentUser.SentFriendRequests.Any(u => u.Id == personId))
            return Result.Fail(new OperationAlreadyApplied("Request is already sent"));

        var friend = await _dbContext.Users
            .Where(u => u.Id == personId)
            .Include(u => u.ReceivedFriendRequests)
            .FirstOrDefaultAsync();

        if (friend is null) return Result.Fail(new PersonNotFoundError(personId));

        currentUser.SentFriendRequests.Add(friend);
        friend.ReceivedFriendRequests.Add(currentUser);
        await _dbContext.SaveChangesAsync();

        return Result.Ok(_userMapper.ToUserProfile(friend, FriendshipStatus.OutcomeRequest));
    }

    public async Task<Result<UserProfile>> RespondToFriendRequestAsync(Guid personId, bool isAccepted)
    {
        var currentUserId = await _currentUserService.GetIdAsync();
        var currentUser = await _dbContext.Users
            .Where(u => u.Id == currentUserId)
            .Include(u => u.ReceivedFriendRequests)
            .Include(u => u.Friends)
            .FirstAsync();

        var userWhoSendRequest = await _dbContext.Users
            .Where(u => u.Id == personId)
            .Include(u => u.SentFriendRequests)
            .Include(u => u.Friends)
            .FirstOrDefaultAsync();

        if (userWhoSendRequest is null) return Result.Fail(new PersonNotFoundError(personId));

        if (currentUser.Friends.Any(u => u.Id == userWhoSendRequest.Id))
            return Result.Fail(new OperationAlreadyApplied("Already Friends with this user"));

        if (currentUser.ReceivedFriendRequests.All(u => u.Id != userWhoSendRequest.Id))
            return Result.Fail(new OperationAlreadyApplied("Doesn't have requests from this user"));


        currentUser.ReceivedFriendRequests.Remove(userWhoSendRequest);
        userWhoSendRequest.SentFriendRequests.Remove(currentUser);
        if (isAccepted)
        {
            currentUser.Friends.Add(userWhoSendRequest);
            userWhoSendRequest.Friends.Add(currentUser);
        }

        await _dbContext.SaveChangesAsync();

        return Result.Ok(_userMapper.ToUserProfile(userWhoSendRequest,
            isAccepted ? FriendshipStatus.Friend : FriendshipStatus.None));
    }

    public async Task<Result<UserProfile>> DeleteFriendAsync(Guid personId)
    {
        var currentUserId = await _currentUserService.GetIdAsync();
        var currentUser = await _dbContext.Users
            .Where(u => u.Id == currentUserId)
            .Include(u => u.Items)
            .ThenInclude(u => u.QueueItems)
            .Include(u => u.Friends)
            .FirstAsync();

        var friend = await _dbContext.Users
            .Where(u => u.Id == personId)
            .Include(u => u.Items)
            .ThenInclude(u => u.QueueItems)
            .Include(u => u.Friends)
            .FirstOrDefaultAsync();

        if (friend is null) return Result.Fail(new PersonNotFoundError(personId));

        if (currentUser.Friends.All(user => user.Id != friend.Id))
            return Result.Fail(new OperationAlreadyApplied("Person is already not your friend"));

        currentUser.Friends.Remove(friend);
        friend.Friends.Remove(currentUser);

        RemoveUserFromItemsQueue(currentUser, friend.Items);
        RemoveUserFromItemsQueue(friend, currentUser.Items);

        await _dbContext.SaveChangesAsync();

        return Result.Ok(_userMapper.ToUserProfile(friend, FriendshipStatus.None));
    }

    private static void RemoveUserFromItemsQueue(UserEntity user, List<ItemEntity> items)
    {
        foreach (var item in items)
        {
            var queueItem = item.QueueItems.FirstOrDefault(qi => qi.UserId == user.Id);
            if (queueItem != null) item.QueueItems.Remove(queueItem);
        }
    }
}