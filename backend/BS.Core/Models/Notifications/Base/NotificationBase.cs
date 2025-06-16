using System.Text.Json.Serialization;
using BS.Core.Models.Notifications.Friendship;
using BS.Core.Models.Notifications.FriendUpdate;
using BS.Core.Models.Notifications.Items;

namespace BS.Core.Models.Notifications.Base;

[JsonPolymorphic(TypeDiscriminatorPropertyName = "Type")]
[JsonDerivedType(typeof(SomeoneBecameHolderOfYourItemNotification), nameof(SomeoneBecameHolderOfYourItemNotification))]
[JsonDerivedType(typeof(SomeoneQueueToItemNotification), nameof(SomeoneQueueToItemNotification))]
[JsonDerivedType(typeof(YourQueuePositionChangedNotification),  nameof(YourQueuePositionChangedNotification))]
[JsonDerivedType(typeof(FriendTakeBookToReadNotification),  nameof(FriendTakeBookToReadNotification))]
[JsonDerivedType(typeof(NewBooksInFriendShelfNotification), nameof(NewBooksInFriendShelfNotification))]
[JsonDerivedType(typeof(FriendshipStatusChangedNotification),  nameof(FriendshipStatusChangedNotification))]
public abstract class NotificationBase
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsRead { get; set; }
} 