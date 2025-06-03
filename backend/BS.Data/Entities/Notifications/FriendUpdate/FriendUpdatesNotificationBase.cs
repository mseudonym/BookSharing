using BS.Data.Entities.Notifications.Base;

namespace BS.Data.Entities.Notifications.FriendUpdate;

public abstract class FriendUpdatesNotificationBase : NotificationEntityBase
{
    public Guid FriendId { get; set; }
    public required UserEntity Friend { get; set; }
}