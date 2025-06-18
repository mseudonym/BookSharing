using BS.Data.Entities.Notifications.Base;

namespace BS.Data.Entities.Notifications.Items;

// Ты держатель или владелец книги, в очередь за которой кто-то добавился
public sealed class SomeoneQueueToItemNotificationEntity : ItemNotificationBaseEntity
{
    public required Guid NewQueueMemberId { get; set; }
    public UserEntity NewQueueMember { get; set; } = null!;
}