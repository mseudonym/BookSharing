namespace BS.Data.Entities.Notifications.FriendUpdate;

public sealed class NewBooksInFriendShelfNotification : FriendUpdatesNotificationBase
{
    public required List<BookEntity> NewBooks { get; set; }
}