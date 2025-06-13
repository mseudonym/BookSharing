namespace BS.Core.Models.Notifications.Items;

public sealed class YourQueuePositionChangedNotification : ItemNotificationBase
{
    public int NewPosition { get; set; }
} 