using System.Text.Json;

namespace BookScrapingService;

public class BookInfo : IEquatable<BookInfo>
{
    private static JsonSerializerOptions Options = new JsonSerializerOptions
    {
        WriteIndented = true,
        Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
    };

    public string Title { get; init; } = null!;
    public string? Author { get; init; }
    public string? Description { get; init; }
    public string BookCoverId { get; init; } = null!;
    public string? ISBN { get; init; }

    public bool Equals(BookInfo? other)
    {
        if (other is null) return false;
        if (ReferenceEquals(this, other)) return true;
        return string.Equals(Title, other.Title, StringComparison.OrdinalIgnoreCase)
               && string.Equals(Author, other.Author, StringComparison.OrdinalIgnoreCase)
               && string.Equals(Description, other.Description, StringComparison.OrdinalIgnoreCase)
               && string.Equals(BookCoverId, other.BookCoverId, StringComparison.OrdinalIgnoreCase)
               && string.Equals(ISBN, other.ISBN, StringComparison.OrdinalIgnoreCase);
    }

    public override bool Equals(object? obj)
    {
        if (obj is null) return false;
        if (ReferenceEquals(this, obj)) return true;
        if (obj.GetType() != GetType()) return false;
        return Equals((BookInfo)obj);
    }

    public override int GetHashCode()
    {
        var hashCode = new HashCode();
        hashCode.Add(Title, StringComparer.OrdinalIgnoreCase);
        hashCode.Add(Author, StringComparer.OrdinalIgnoreCase);
        hashCode.Add(Description, StringComparer.OrdinalIgnoreCase);
        hashCode.Add(BookCoverId, StringComparer.OrdinalIgnoreCase);
        hashCode.Add(ISBN, StringComparer.OrdinalIgnoreCase);
        return hashCode.ToHashCode();
    }

    public override string ToString()
    {
        return JsonSerializer.Serialize(this, Options);
    }
}