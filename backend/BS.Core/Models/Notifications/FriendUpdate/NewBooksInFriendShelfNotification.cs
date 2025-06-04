using BS.Core.Models.Book;

namespace BS.Core.Models.Notifications.FriendUpdate;

public sealed class NewBooksInFriendShelfNotification : FriendUpdatesNotificationBase
{
    public required List<BookModel> NewBooks { get; set; }
} 