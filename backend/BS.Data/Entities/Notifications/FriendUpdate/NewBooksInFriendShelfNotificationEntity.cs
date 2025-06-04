namespace BS.Data.Entities.Notifications.FriendUpdate;

public sealed class NewBooksInFriendShelfNotificationEntity : FriendUpdatesNotificationBaseEntity
{
    public required List<BookEntity> NewBooks { get; set; }
}