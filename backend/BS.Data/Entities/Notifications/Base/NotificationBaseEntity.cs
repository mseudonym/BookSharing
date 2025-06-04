namespace BS.Data.Entities.Notifications.Base;

public abstract class NotificationBaseEntity
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public Guid RecipientId { get; set; }
    public required UserEntity Recipient { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsRead { get; set; } = false;
    public bool IsDeleted { get; set; } = false;
}