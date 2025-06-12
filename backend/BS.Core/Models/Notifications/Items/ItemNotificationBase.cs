using BS.Core.Models.Book;
using BS.Core.Models.Notifications.Base;

namespace BS.Core.Models.Notifications.Items;

public abstract class ItemNotificationBase : NotificationBase
{
    public Guid ItemId { get; set; }
    public required BookModel Book { get; set; }
} 