using BS.Api.Extensions;
using BS.Core.Errors;
using BS.Core.Errors.Validation;
using FluentResults;
using Microsoft.AspNetCore.Mvc;

namespace BS.Api.Results;

public static class ErrorStatusCodeMapper
{
    public static ObjectResult MapResult(ResultBase result)
    {
        var validationErrors = result.Errors
            .OfType<ValidationError>()
            .GroupBy(e => e.ErrorCode)
            .ToDictionary(
                g => g.Key,
                g => g.Select(e => e.Message).ToArray()
            );
        
        return result switch
        {
            // 400
            _ when result.HasError<ValidationError>()
                => new BadRequestObjectResult(TypedResults.ValidationProblem(validationErrors)),

            // 200
            _ when result.HasError<OperationAlreadyApplied>()
                => new OkObjectResult(result.ErrorsToString()),

            // 404
            _ when result.HasError<PersonNotFoundError>() ||
                   result.HasError<BookNotFoundError>() ||
                   result.HasError<ItemNotFoundError>()
                => new NotFoundObjectResult(result.ErrorsToString()),

            // 403
            _ when result.HasError<PersonIsNotYourFriendError>() ||
                   result.HasError<OperationForbiddenError>()
                => new ObjectResult(result.ErrorsToString())
                { StatusCode = 403 },

            // 500
            _ => new ObjectResult(result.ErrorsToString())
                { StatusCode = 500 },
        };
    }
    
        public static IResult MapMinimalResult(ResultBase result)
        {
            var validationErrors = result.Errors
                .OfType<ValidationError>()
                .GroupBy(e => e.ErrorCode)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(e => e.Message).ToArray()
                );
            
            return result switch
            {
                // 400
                _ when result.HasError<ValidationError>()
                    => TypedResults.ValidationProblem(validationErrors),

                // 200
                _ when result.HasError<OperationAlreadyApplied>()
                    => TypedResults.Ok(result.ErrorsToString()),

                // 404
                _ when result.HasError<PersonNotFoundError>() ||
                       result.HasError<BookNotFoundError>() ||
                       result.HasError<ItemNotFoundError>()
                    => TypedResults.NotFound(result.ErrorsToString()),

                // 403
                _ when result.HasError<PersonIsNotYourFriendError>() ||
                       result.HasError<OperationForbiddenError>()
                    => TypedResults.Forbid(),

                // 500
                _ => TypedResults.InternalServerError(result.ErrorsToString()),
            };
        }
}