using FluentResults;

namespace BS.Core.Errors;

public class ItemNotFoundError(Guid id) : Error($"Item with id {id} was not found.");