using BS.Core.Models.S3;

namespace BS.Core.Models.Book;

public class AddBookModel
{
    public required string Title { get; init; }
    public required string Author { get; init; }
    public required string Description { get; init; }
    public string? Isbn { get; init; }
    public required string Language { get; set; }
    public int? PublicationYear { get; set; }
    public PhotoFileModel? BookCover { get; set; }
}