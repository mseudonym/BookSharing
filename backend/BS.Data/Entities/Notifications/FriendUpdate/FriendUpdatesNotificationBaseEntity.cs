using BS.Data.Entities.Notifications.Base;

namespace BS.Data.Entities.Notifications.FriendUpdate;

public abstract class FriendUpdatesNotificationBaseEntity : NotificationBaseEntity
{
    public Guid FriendId { get; set; }
    public UserEntity Friend { get; set; } = null!;
}