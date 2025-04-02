using FluentResults;

namespace BS.Core.Errors.Queue;

public class UserDoesNotOwnItemError(string message): Error(message);