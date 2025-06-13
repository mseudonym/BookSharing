using BS.Core.Models.User;

namespace BS.Core.Models.Notifications.Items;

public sealed class SomeoneQueueToItemNotification : ItemNotificationBase
{
    public required UserProfile NewQueueMember { get; set; }
} 