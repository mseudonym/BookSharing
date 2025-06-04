using BS.Core.Models.Notifications.Base;
using BS.Core.Models.Items;
using BS.Core.Models.Book;

namespace BS.Core.Models.Notifications.Items;

public abstract class ItemNotificationBase : NotificationBase
{
    public Guid ItemId { get; set; }
    public Guid BookId { get; set; }
    public required BookModel Book { get; set; }
} 