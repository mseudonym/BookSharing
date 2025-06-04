using System.Text.Json.Serialization;
using BS.Core.Models.Notifications.Items;
using BS.Core.Models.Notifications.FriendUpdate;
using BS.Core.Models.Notifications.Friendship;

namespace BS.Core.Models.Notifications.Base;

[JsonPolymorphic(TypeDiscriminatorPropertyName = "$type")]
[JsonDerivedType(typeof(SomeoneBecameHolderOfYourItemNotification), "SomeoneBecameHolderOfYourItemNotification")]
[JsonDerivedType(typeof(SomeoneQueueToItemNotification), "SomeoneQueueToItemNotification")]
[JsonDerivedType(typeof(YourQueuePositionChangedNotification), "YourQueuePositionChangedNotification")]
[JsonDerivedType(typeof(FriendTakeBookToReadNotification), "FriendTakeBookToReadNotification")]
[JsonDerivedType(typeof(NewBooksInFriendShelfNotification), "NewBooksInFriendShelfNotification")]
[JsonDerivedType(typeof(FriendshipStatusChangedNotification), "FriendshipStatusChangedNotification")]
public abstract class NotificationBase
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsRead { get; set; }
} 