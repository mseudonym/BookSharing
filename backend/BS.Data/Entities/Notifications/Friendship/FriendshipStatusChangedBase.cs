using BS.Data.Entities.Notifications.Base;

namespace BS.Data.Entities.Notifications.Friendship;

public abstract class FriendshipStatusChangedBase : NotificationEntityBase
{
    public Guid PersonId { get; set; }
    public required UserEntity Person { get; set; }
}