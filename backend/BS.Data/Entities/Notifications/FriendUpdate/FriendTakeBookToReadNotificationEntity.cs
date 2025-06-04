namespace BS.Data.Entities.Notifications.FriendUpdate;

public sealed class FriendTakeBookToReadNotificationEntity : FriendUpdatesNotificationBaseEntity
{
    public required Guid BookId { get; set; }
    public required BookEntity Book { get; set; }
}