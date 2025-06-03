using BS.Data.Entities.Notifications.Base;

namespace BS.Data.Entities.Notifications.Items;

// Твоя позиция в очереди изменилась
public sealed class YourQueuePositionChangedNotification : ItemNotificationBase
{
    public int NewPosition { get; set; }
}