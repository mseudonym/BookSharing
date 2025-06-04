using BS.Core.Models.S3;
using BS.Core.Models.User;
using FluentValidation;
using static BS.Data.Validations.DataUserValidationConstants;

namespace BS.Core.Validations;

public class EditProfileModelValidator : AbstractValidator<EditProfileModel>
{
    public EditProfileModelValidator()
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

        RuleFor(model => model.Photo)
            .NotNull()
            .SetValidator(new PhotoFileModelValidator() as IValidator<PhotoFileModel?>)
            .When(photo => photo.Photo is not null);
    }
}