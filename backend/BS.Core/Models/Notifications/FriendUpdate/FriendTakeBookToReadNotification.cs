using BS.Core.Models.Book;

namespace BS.Core.Models.Notifications.FriendUpdate;

public sealed class FriendTakeBookToReadNotification : FriendUpdatesNotificationBase
{
    public required BookModel Book { get; set; }
} 