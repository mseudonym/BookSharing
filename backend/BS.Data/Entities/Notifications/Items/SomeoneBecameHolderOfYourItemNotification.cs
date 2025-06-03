using BS.Data.Entities.Notifications.Base;

namespace BS.Data.Entities.Notifications.Items;

// Кто-то стал держателем вашей книги
public sealed class SomeoneBecameHolderOfYourItemNotification : ItemNotificationBase
{
    public required UserEntity NewHolder { get; set; }
}