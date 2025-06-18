using System.Text.Json.Serialization;

namespace BS.Data.Entities.Notifications.Base;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum NotificationType
{
    FriendshipStatusChanged = 0,
    FriendTakeBookToRead = 1,
    NewBooksInFriendShelf = 2,
    SomeoneBecameHolderOfYourItem = 3,
    SomeoneQueueToItem = 4,
    YourQueuePositionChanged = 5,
    ReadingProgressReminder = 6,
}