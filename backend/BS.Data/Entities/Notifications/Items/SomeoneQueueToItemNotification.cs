using BS.Data.Entities.Notifications.Base;

namespace BS.Data.Entities.Notifications.Items;

// Ты держатель или владелец книги, в очередь за которой кто-то добавился
public sealed class SomeoneQueueToItemNotification : ItemNotificationBase
{
    public required UserEntity NewQueueMember { get; set; }
}