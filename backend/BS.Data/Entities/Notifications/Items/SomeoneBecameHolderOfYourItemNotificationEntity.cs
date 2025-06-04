namespace BS.Data.Entities.Notifications.Items;

// Кто-то стал держателем вашей книги
public sealed class SomeoneBecameHolderOfYourItemNotificationEntity : ItemNotificationBaseEntity
{
    public required Guid NewHolderId { get; set; }
    public required UserEntity NewHolder { get; set; }
}