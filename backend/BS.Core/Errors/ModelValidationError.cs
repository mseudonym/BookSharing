using FluentResults;

namespace BS.Core.Errors;

public class ModelValidationError(string message) : Error(message);