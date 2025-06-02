using FluentResults;

namespace BS.Core.Errors.Validation;

public class ValidationError : Error
{
    public ValidationError(string errorCode, string message) : base(message)
    {
        ErrorCode = errorCode;
    }
    public string ErrorCode { get; set; }
}