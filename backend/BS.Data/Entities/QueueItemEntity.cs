namespace BS.Data.Entities;

public class QueueItemEntity
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public UserEntity User { get; set; } = null!;
    public Guid ItemId { get; set; }
    public ItemEntity Item { get; set; } = null!;
    public DateTime EnqueueTimeUtc { get; set; }
    public bool IsForcedFirstByOwner { get; set; }
}