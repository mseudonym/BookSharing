using BS.Data.Entities.Notifications.Friendship;
using BS.Data.Entities.Notifications.FriendUpdate;
using BS.Data.Entities.Notifications.Items;

namespace BS.Data.Entities.Notifications.Base;

public static class NotificationTypeMap
{
    public static readonly (Type Type, NotificationType NotificationType)[] Map =
    [
        (typeof(FriendshipStatusChangedNotificationEntity), NotificationType.FriendshipStatusChanged),
        (typeof(FriendTakeBookToReadNotificationEntity), NotificationType.FriendTakeBookToRead),
        (typeof(NewBooksInFriendShelfNotificationEntity), NotificationType.NewBooksInFriendShelf),
        (typeof(SomeoneBecameHolderOfYourItemNotificationEntity), NotificationType.SomeoneBecameHolderOfYourItem),
        (typeof(SomeoneQueueToItemNotificationEntity), NotificationType.SomeoneQueueToItem),
        (typeof(YourQueuePositionChangedNotificationEntity), NotificationType.YourQueuePositionChanged)
    ];

    private static readonly IReadOnlyDictionary<Type, NotificationType> TypeToNotificationType =
        Map.ToDictionary(x => x.Type, x => x.NotificationType);

    public static NotificationType GetNotificationType(Type type) =>
        TypeToNotificationType.TryGetValue(type, out var result)
            ? result
            : throw new ArgumentOutOfRangeException(nameof(type), $"Unknown notification type: {type.FullName}");
}