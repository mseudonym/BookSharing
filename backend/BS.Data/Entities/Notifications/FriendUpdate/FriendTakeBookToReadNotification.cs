namespace BS.Data.Entities.Notifications.FriendUpdate;

public sealed class FriendTakeBookToReadNotification : FriendUpdatesNotificationBase
{
    public required BookEntity Book { get; set; }
}