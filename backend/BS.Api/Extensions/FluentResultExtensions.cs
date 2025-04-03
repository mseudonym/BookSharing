using FluentResults;

namespace BS.Api.Extensions;

public static class FluentResultExtensions
{
    public static string ErrorsToString(this ResultBase result) =>
        string.Join("; ", result.Errors.Select(error => error.Message));
}