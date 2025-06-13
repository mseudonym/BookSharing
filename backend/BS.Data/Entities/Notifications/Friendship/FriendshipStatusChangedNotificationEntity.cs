using BS.Data.Entities.Notifications.Base;

namespace BS.Data.Entities.Notifications.Friendship;

public sealed class FriendshipStatusChangedNotificationEntity : NotificationBaseEntity
{
    public required Guid PersonId { get; set; }
    public UserEntity Person { get; set; } = null!;
    public required FriendshipStatus NewStatus { get; set; }
}