namespace BS.Data.Entities.Notifications.FriendUpdate;

public sealed class FriendTakeBookToReadNotificationEntity : FriendUpdatesNotificationBaseEntity
{
    public required BookEntity Book { get; set; }
}