using BS.Api.Extensions;
using BS.Core.Errors;
using BS.Core.Errors.Validation;
using FluentResults;
using Microsoft.AspNetCore.Mvc;

namespace BS.Api.Results;

public static class ErrorStatusCodeMapper
{
    public static ActionResult MapResult(Result result)
    {
        if (result.IsSuccess)
            return new OkResult();
        return MapErrorResult(result);
    }

    public static ActionResult MapResult<T>(Result<T> result)
    {
        if (result.IsSuccess)
            return new OkObjectResult(result.Value);
        return MapErrorResult(result);
    }

    private static ActionResult MapErrorResult(ResultBase result)
    {
        var validationErrors = GetValidationErrors(result);
        return result switch
        {
            // 400
            _ when result.HasError<ValidationError>()
                => new BadRequestObjectResult(TypedResults.ValidationProblem(validationErrors)),

            // 404
            _ when result.HasError<PersonNotFoundError>() ||
                   result.HasError<BookNotFoundError>() ||
                   result.HasError<ItemNotFoundError>()
                => new NotFoundObjectResult(result.ErrorsToString()),

            // 403
            _ when result.HasError<PersonIsNotYourFriendError>() ||
                   result.HasError<OperationForbiddenError>()
                => new ObjectResult(result.ErrorsToString()) { StatusCode = 403 },

            // 204
            _ when result.HasError<OperationAlreadyApplied>()
                => new NoContentResult(),

            // 500
            _ => new ObjectResult(result.ErrorsToString()) { StatusCode = 500 },
        };
    }

    private static Dictionary<string, string[]> GetValidationErrors(ResultBase result)
    {
        return result.Errors
            .OfType<ValidationError>()
            .GroupBy(e => e.ErrorCode)
            .ToDictionary(
                g => g.Key,
                g => g.Select(e => e.Message).ToArray()
            );
    }

    public static IResult MapMinimalResult(Result result)
    {
        if (result.IsSuccess)
            return TypedResults.Ok();
        return MapMinimalErrorResult(result);
    }

    public static IResult MapMinimalResult<T>(Result<T> result)
    {
        if (result.IsSuccess)
            return TypedResults.Ok(result.Value);
        return MapMinimalErrorResult(result);
    }

    private static IResult MapMinimalErrorResult(ResultBase result)
    {
        var validationErrors = GetValidationErrors(result);
        return result switch
        {
            // 400
            _ when result.HasError<ValidationError>()
                => TypedResults.ValidationProblem(validationErrors),

            // 404
            _ when result.HasError<PersonNotFoundError>() ||
                   result.HasError<BookNotFoundError>() ||
                   result.HasError<ItemNotFoundError>()
                => TypedResults.NotFound(result.ErrorsToString()),

            // 403
            _ when result.HasError<PersonIsNotYourFriendError>() ||
                   result.HasError<OperationForbiddenError>()
                => TypedResults.Forbid(),

            // 204
            _ when result.HasError<OperationAlreadyApplied>()
                => TypedResults.NoContent(),

            // 500
            _ => TypedResults.InternalServerError(result.ErrorsToString()),
        };
    }
}