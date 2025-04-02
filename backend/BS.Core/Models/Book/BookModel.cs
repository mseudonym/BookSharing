namespace BS.Core.Models.Book;

public class BookModel
{
    public Guid Id { get; init; }
    public string Title { get; init; } = null!;
    public string Author { get; init; } = null!;
    public string Description { get; init; } = null!;
    public string? BookCoverUrl { get; init; }
    public string? Isbn { get; init; }
    public string? Language { get; set; }
    public int? PublicationYear { get; set; }
    public bool IsPhotoUploaded { get; set; }
    public bool IsAddedByUser { get; set; }
}