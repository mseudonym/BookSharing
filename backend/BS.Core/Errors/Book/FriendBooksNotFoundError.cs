using FluentResults;

namespace BS.Core.Errors.Book;

public class FriendBooksNotFoundError() : Error("Cannot find all friends books for this user");