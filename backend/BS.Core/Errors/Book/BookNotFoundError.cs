using FluentResults;

namespace BS.Core.Errors.Book;

public class BookNotFoundByTitleError(string name) : Error($"Book with title '{name}' was not found.");

public class BookNotFoundByIsbnError(string isbn) : Error($"Book with ISBN '{isbn}' was not found.");

public class BookNotFoundByIdError(Guid id) : Error($"Book with id '{id}' was not found.");