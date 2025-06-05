namespace BS.Data.Entities.Notifications.FriendUpdate;

public sealed class FriendTakeBookToReadNotificationEntity : FriendUpdatesNotificationBaseEntity
{
    public required Guid BookId { get; set; }
    public BookEntity Book { get; set; } = null!;
}