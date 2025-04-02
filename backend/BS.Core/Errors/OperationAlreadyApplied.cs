using FluentResults;

namespace BS.Core.Errors;

public class OperationAlreadyApplied (string message) : Error(message);