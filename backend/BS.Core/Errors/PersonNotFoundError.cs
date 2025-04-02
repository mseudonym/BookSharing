using FluentResults;

namespace BS.Core.Errors;

public class PersonNotFoundError : Error
{
    public PersonNotFoundError(Guid id) : base($"Person with id {id} was not found.")
    {
    }

    public PersonNotFoundError(string username) : base($"Person with username {username} was not found.")
    {
    }
}
