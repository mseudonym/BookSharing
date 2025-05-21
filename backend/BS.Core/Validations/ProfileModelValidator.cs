using BS.Core.Models.User;
using FluentValidation;
using static BS.Data.Validations.DataUserValidationConstants;

namespace BS.Core.Validations;

public class ProfileModelValidator : AbstractValidator<EditProfileModel>
{
    public ProfileModelValidator()
    {
        RuleFor(model => model.FirstName)
            .NotEmpty()
            .MaximumLength(FirstNameMaxLength);

        RuleFor(model => model.LastName)
            .NotEmpty()
            .MaximumLength(LastNameMaxLength);

        RuleFor(model => model.Username)
            .SetValidator(new UsernameValidator());

        RuleFor(model => model.ContactUrl)
            .NotEmpty()
            .MaximumLength(ContactUrlMaxLength)
            .Must(url => Uri.TryCreate(url, UriKind.Absolute, out _))
            .WithMessage("ContactUrl is invalid");
    }
}