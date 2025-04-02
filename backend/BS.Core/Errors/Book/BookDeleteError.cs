using FluentResults;

namespace BS.Core.Errors.Book;

public class BookDeleteError(int count) : Error($"Books deleted count: {count}.");