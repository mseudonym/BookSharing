namespace BS.Data.Entities.Notifications.Items;

// Ты держатель или владелец книги, в очередь за которой кто-то добавился
public sealed class SomeoneQueueToItemNotificationEntity : ItemNotificationBaseEntity
{
    public required Guid NewQueueMemberId { get; set; }
    public required UserEntity NewQueueMember { get; set; }
}