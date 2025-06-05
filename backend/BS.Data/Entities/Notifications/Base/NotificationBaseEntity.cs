namespace BS.Data.Entities.Notifications.Base;

public abstract class NotificationBaseEntity
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public required Guid RecipientId { get; set; }
    public UserEntity Recipient { get; set; } = null!;
    public required DateTime CreatedAt { get; set; }
    public DateTime? ShouldBeSentAt { get; set; }
    public bool IsRead { get; set; } = false;
}