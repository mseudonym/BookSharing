using System.Text.Json.Serialization;
using BS.Core.Models.Notifications.Friendship;
using BS.Core.Models.Notifications.FriendUpdate;
using BS.Core.Models.Notifications.Items;
using BS.Data.Entities.Notifications.Base;

namespace BS.Core.Models.Notifications.Base;

[JsonPolymorphic(TypeDiscriminatorPropertyName = "$type")]
[JsonDerivedType(typeof(SomeoneBecameHolderOfYourItemNotification),
    (int)NotificationType.SomeoneBecameHolderOfYourItem)]
[JsonDerivedType(typeof(SomeoneQueueToItemNotification), (int)NotificationType.SomeoneQueueToItem)]
[JsonDerivedType(typeof(YourQueuePositionChangedNotification), (int)NotificationType.YourQueuePositionChanged)]
[JsonDerivedType(typeof(FriendTakeBookToReadNotification), (int)NotificationType.FriendTakeBookToRead)]
[JsonDerivedType(typeof(NewBooksInFriendShelfNotification), (int)NotificationType.NewBooksInFriendShelf)]
[JsonDerivedType(typeof(FriendshipStatusChangedNotification), (int)NotificationType.FriendshipStatusChanged)]
public abstract class NotificationBase
{
    public NotificationType Type { get; set; }
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsRead { get; set; }
}