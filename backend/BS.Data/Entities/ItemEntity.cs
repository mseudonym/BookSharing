namespace BS.Data.Entities;

public class ItemEntity
{
    public Guid Id { get; set; }
    public Guid OwnerId { get; set; }
    public UserEntity Owner { get; set; } = null!;
    public Guid? BookId { get; set; }
    public BookEntity Book { get; set; } = null!;
    public Guid HolderId { get; set; }
    public List<QueueItemEntity> QueueItems { get; set; } = [];
    public DateTime CreatedUtc { get; set; }
}