namespace BS.Api.Requests;

public class AddBookRequest
{
    public required string Title { get; set; }
    public required string Author { get; init; }
    public required string Description { get; init; }
    public string? Isbn { get; init; }
    public required string Language { get; set; }

    public int? PublicationYear { get; set; }
    public required IFormFile BookCover { get; set; }
}