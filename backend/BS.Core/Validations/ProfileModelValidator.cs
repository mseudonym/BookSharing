using BS.Core.Models.User;
using FluentValidation;
using static BS.Data.Validations.DataUserValidationConstants;

namespace BS.Core.Validations;

public class ProfileModelValidator : AbstractValidator<EditProfileModel>
{
    private readonly Uri[] _availableSocialDomains =
    [
        new("https://vk.com"),
        new("https://instagram.com"),
        new("https://t.me"),
        new("https://facebook.com")
    ];

    public ProfileModelValidator()
    {   
        RuleFor(model => model.FirstName)
            .NotNull()
            .NotEmpty()
            .MaximumLength(FirstNameMaxLength);
        
        RuleFor(model => model.LastName)
            .NotNull()
            .NotEmpty()
            .MaximumLength(LastNameMaxLength);

        RuleFor(model => model.Username)
            .SetValidator(new UsernameValidator());
        
        RuleFor(model => model.ContactUrl)
            .NotNull()
            .NotEmpty()
            .MaximumLength(ContactUrlMaxLength)
            .Custom((contactUrlInString, context) =>
            {
                if (string.IsNullOrEmpty(contactUrlInString))
                {
                    context.AddFailure(context.PropertyPath, "Contact URL is invalid");
                    return;
                }
                
                var contactUrl = new Uri(contactUrlInString);

                if (_availableSocialDomains.All(domain => domain.Host != contactUrl.Host))
                {
                    context.AddFailure(context.PropertyPath, "That social domain is not valid");
                }
            });
    }
}