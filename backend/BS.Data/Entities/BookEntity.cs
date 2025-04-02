namespace BS.Data.Entities;

public class BookEntity
{
    public Guid Id { get; set; }
    public required string Title { get; set; }
    public required string Author { get; set; }
    public required string Description { get; set; }
    public string? Isbn { get; set; }
    public required string Language { get; set; }
    public int? PublicationYear { get; set; }
    public bool IsPhotoUploaded { get; set; }
    public bool IsAddedByUser { get; set; }
    public ICollection<ItemEntity> Items { get; set; } = null!;
}