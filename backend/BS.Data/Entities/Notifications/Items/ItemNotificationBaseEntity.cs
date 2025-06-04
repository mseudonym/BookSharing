using BS.Data.Entities.Notifications.Base;

namespace BS.Data.Entities.Notifications.Items;

public abstract class ItemNotificationBaseEntity : NotificationBaseEntity
{
    public Guid ItemId { get; set; }
    public required ItemEntity Item { get; set; }
}