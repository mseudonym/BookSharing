using BS.Core.Errors;
using BS.Core.Errors.Validation;
using FluentResults;
using FluentValidation.Results;

namespace BS.Core.Extensions;

public static class ValidationResultExtensions
{
    public static async Task<Result> ToTypedResult(this Task<ValidationResult> validationResultTask)
    {
        var validationResult = await validationResultTask;
        if (validationResult.IsValid)
            return Result.Ok();

        var errors = validationResult.Errors.Select(error =>
            new ValidationError(error.PropertyName.Replace(".", "") + "_" + error.ErrorCode, error.ErrorMessage)
        );

        return Result.Fail(errors);
    }
}