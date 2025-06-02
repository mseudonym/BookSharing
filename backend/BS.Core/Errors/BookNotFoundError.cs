using FluentResults;

namespace BS.Core.Errors;

public class BookNotFoundError : Error
{
    private BookNotFoundError(string message) : base(message)
    {
    }

    public static BookNotFoundError ById(Guid id)
        => new($"Book with id '{id}' was not found.");

    public static BookNotFoundError ByTitle(string title)
        => new($"Book with title '{title}' was not found.");

    public static BookNotFoundError ByIsbn(string isbn)
        => new($"Book with ISBN '{isbn}' was not found.");
}
