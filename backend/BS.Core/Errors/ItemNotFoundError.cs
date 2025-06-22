using FluentResults;

namespace BS.Core.Errors;

public class ItemNotFoundError : Error
{
    private ItemNotFoundError(string message) : base(message)
    {
    }

    public static ItemNotFoundError ById(Guid id)
        => new($"Item with id {id} was not found.");

    public static ItemNotFoundError ByBookId(Guid id)
        => new($"Item with id '{id}' was not found in your shelf.");
}
