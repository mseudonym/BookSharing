using BS.Core.Models.User;

namespace BS.Core.Models.Notifications.Items;

public sealed class SomeoneBecameHolderOfYourItemNotification : ItemNotificationBase
{
    public required UserProfile NewHolder { get; set; }
} 