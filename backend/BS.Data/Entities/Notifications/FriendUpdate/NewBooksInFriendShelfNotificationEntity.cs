namespace BS.Data.Entities.Notifications.FriendUpdate;

public sealed class NewBooksInFriendShelfNotificationEntity : FriendUpdatesNotificationBaseEntity
{
    public required Guid[] NewBookIds { get; set; }
}