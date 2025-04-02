using FluentResults;

namespace BS.Core.Errors.Book;

public class BookAlreadyAddedError(string isbn) : Error($"Book with ISBN '{isbn}' already added.");