using BS.Core.Models.User;
using FluentResults;

namespace BS.Core.Services.Friends;

public interface IFriendsService
{
    public Task<Result<UserProfile[]>> GetFriendsAsync();
    public Task<Result<UserProfile[]>> GetSentFriendRequestsAsync();
    public Task<Result<UserProfile[]>> GetReceivedFriendRequestsAsync();
    public Task<Result<UserProfile>> SendFriendRequestAsync(Guid personId);
    public Task<Result<UserProfile>> CancelFriendRequestAsync(Guid personId);
    public Task<Result<UserProfile>> RespondToFriendRequestAsync(Guid personId, bool isAccepted);
    public Task<Result<UserProfile>> DeleteFriendAsync(Guid personId);
}