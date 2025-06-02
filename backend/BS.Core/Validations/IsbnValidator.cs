using FluentValidation;

namespace BS.Core.Validations;

public class IsbnValidator : AbstractValidator<string?>
{
    public IsbnValidator()
    {
        RuleFor(isbn => isbn)
            .NotEmpty()
            .Matches(@"^\d{3}-\d{1,5}-\d{1,7}-\d{1,7}-\d{1}$")
            .WithMessage("Invalid ISBN format.")
            .WithErrorCode("InvalidIsbnFormat");
    }
}