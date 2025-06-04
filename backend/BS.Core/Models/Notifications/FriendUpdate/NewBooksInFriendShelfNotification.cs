namespace BS.Core.Models.Notifications.FriendUpdate;

public sealed class NewBooksInFriendShelfNotification : FriendUpdatesNotificationBase
{
    public required string[] NewBooksCoverUrls { get; set; }
} 