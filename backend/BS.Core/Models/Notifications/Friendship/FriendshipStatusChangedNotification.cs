using BS.Core.Models.Notifications.Base;
using BS.Core.Models.User;
using BS.Data.Entities.Notifications.Friendship;

namespace BS.Core.Models.Notifications.Friendship;

public sealed class FriendshipStatusChangedNotification : NotificationBase
{
    public Guid PersonId { get; set; }
    public required UserProfile Person { get; set; }
    public FriendshipStatus NewStatus { get; set; }
} 