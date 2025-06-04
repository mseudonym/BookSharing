using BS.Data.Entities.Notifications.Base;

namespace BS.Data.Entities.Notifications.Friendship;

public sealed class FriendshipStatusChangedNotificationEntity : NotificationBaseEntity
{
    public Guid PersonId { get; set; }
    public required UserEntity Person { get; set; }
    public FriendshipStatus NewStatus { get; set; }
}