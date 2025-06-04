using BS.Data.Entities.Notifications.Base;

namespace BS.Data.Entities.Notifications.Items;

public abstract class ItemNotificationBaseEntity : NotificationBaseEntity
{
    public Guid ItemId { get; set; }
    public required UserEntity Item { get; set; }
    public Guid BookId { get; set; }
    public required BookEntity Book { get; set; }
}