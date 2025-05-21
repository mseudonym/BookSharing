using BS.Api.Extensions;
using BS.Core.Errors;
using BS.Core.Errors.Book;
using FluentResults;
using Microsoft.AspNetCore.Mvc;

namespace BS.Api.Results;

public static class ErrorStatusCodeMapper
{
    public static ObjectResult MapResult(ResultBase result)
    {
        var errorDictionary = result.Errors
            .GroupBy(e => e.GetType().Name)
            .ToDictionary(
                g => g.Key,
                g => g.Select(e => e.Message).ToArray()
            );
        
        return result switch
        {
            // 400
            _ when result.HasError<EmptyTitleError>() ||
                   result.HasError<InvalidIsbnError>() ||
                   result.HasError<BookDeleteError>() ||
                   result.HasError<ModelValidationError>() ||
                   result.HasError<FriendNotFoundError>() ||
                   result.HasError<UsernameSearchPrefixTooShortError>() ||
                   result.HasError<UsernameAlreadyTakenError>() ||
                   result.HasError<BookAlreadyAddedError>()
                => new BadRequestObjectResult(TypedResults.ValidationProblem(errorDictionary)),

            // 200
            _ when result.HasError<OperationAlreadyApplied>()
                => new OkObjectResult(result.ErrorsToString()),

            // 404
            _ when result.HasError<PersonNotFoundError>() ||
                   result.HasError<BookNotFoundByTitleError>() ||
                   result.HasError<BookNotFoundByIsbnError>() ||
                   result.HasError<BookNotFoundByIdError>()
                => new NotFoundObjectResult(result.ErrorsToString()),

            // 403
            _ when result.HasError<PersonIsNotYourFriendError>() => new ObjectResult(result.ErrorsToString())
                { StatusCode = 403 },

            // 500
            _ => new ObjectResult(result.ErrorsToString())
                { StatusCode = 500 },
        };
    }
}