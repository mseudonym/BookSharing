using FluentResults;

namespace BS.Core.Errors.Book;

public class InvalidIsbnError(string isbn) : Error($"Invalid ISBN: {isbn}.");