using BS.Core.Models.Notifications.Base;
using BS.Core.Models.User;

namespace BS.Core.Models.Notifications.FriendUpdate;

public abstract class FriendUpdatesNotificationBase : NotificationBase
{
    public Guid FriendId { get; set; }
    public required UserProfile Friend { get; set; }
} 