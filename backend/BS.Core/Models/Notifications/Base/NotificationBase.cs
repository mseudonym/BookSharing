using System.Text.Json.Serialization;
using BS.Core.Models.Notifications.Friendship;
using BS.Core.Models.Notifications.FriendUpdate;
using BS.Core.Models.Notifications.Items;
using BS.Data.Entities.Notifications.Base;

namespace BS.Core.Models.Notifications.Base;

[JsonPolymorphic(TypeDiscriminatorPropertyName = "type")]
[JsonDerivedType(typeof(SomeoneBecameHolderOfYourItemNotification), 
    nameof(NotificationType.SomeoneBecameHolderOfYourItem))]
[JsonDerivedType(typeof(SomeoneQueueToItemNotification), nameof(NotificationType.SomeoneQueueToItem))]
[JsonDerivedType(typeof(YourQueuePositionChangedNotification), nameof(NotificationType.YourQueuePositionChanged))]
[JsonDerivedType(typeof(FriendTakeBookToReadNotification), nameof(NotificationType.FriendTakeBookToRead))]
[JsonDerivedType(typeof(NewBooksInFriendShelfNotification), nameof(NotificationType.NewBooksInFriendShelf))]
[JsonDerivedType(typeof(FriendshipStatusChangedNotification), nameof(NotificationType.FriendshipStatusChanged))]
public abstract class NotificationBase
{
    public required Guid Id { get; set; }
    public required DateTime CreatedAt { get; set; }
    public required bool IsRead { get; set; }
}