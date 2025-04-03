using FluentResults;

namespace BS.Core.Errors.Book;

public class FriendNotFoundError(Guid id) : Error($"friend with id: '{id}' was not in user friendList");