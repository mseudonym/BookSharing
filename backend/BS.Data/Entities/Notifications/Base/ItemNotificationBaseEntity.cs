namespace BS.Data.Entities.Notifications.Base;

public abstract class ItemNotificationBaseEntity : NotificationBaseEntity
{
    public Guid ItemId { get; set; }
    public ItemEntity Item { get; set; } = null!;
}