using FluentResults;

namespace BS.Core.Errors.Queue;

public class UserAlreadyInQueueError(string message) : Error(message);