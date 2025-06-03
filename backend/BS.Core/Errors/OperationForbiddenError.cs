using FluentResults;

namespace BS.Core.Errors;

public class OperationForbiddenError(string message) : Error(message);