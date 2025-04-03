using FluentValidation.Results;

namespace BS.Core.Extensions;

public static class ValidationResultExtensions
{
    public static string ErrorsToString(this ValidationResult result) =>
        string.Join("; ", result.Errors.Select(error => error.ErrorMessage));
}