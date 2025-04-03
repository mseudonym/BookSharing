using FluentValidation;
using static BS.Data.Validations.DataUserValidationConstants;

namespace BS.Core.Validations;

public class UsernameValidator : AbstractValidator<string?>
{
    private const string UnderScope = "_";

    public UsernameValidator()
    {
        RuleFor(username => username)
            .NotEmpty()
            .MinimumLength(5)
            .MaximumLength(UsernameMaxLength)
            .Must(username => !username.StartsWith(UnderScope) && !char.IsDigit(username[0]))
            .WithMessage("Username cannot start with under scope or digit")
            .Must(username => !username.EndsWith(UnderScope))
            .WithMessage("Username should end with under scope")
            .Must(username => !username.Contains(UnderScope + UnderScope))
            .WithMessage("Username cannot contain double under scope")
            .Matches("^[a-zA-Z0-9_]+$")
            .WithMessage("Username should contain letters or digits or under scope");
    }
}