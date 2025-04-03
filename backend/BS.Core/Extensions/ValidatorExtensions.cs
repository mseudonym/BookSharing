using BS.Core.Models.User;
using FluentValidation;
using FluentValidation.Results;

namespace BS.Core.Extensions;

public static class ValidatorExtensions
{
    public static async Task<ValidationResult> ValidateNotNullFieldsAsync(
        this IValidator<EditProfileModel> validator,
        EditProfileModel model) =>
        await validator.ValidateAsync(model, options =>
        {
            if (!string.IsNullOrEmpty(model.FirstName))
                options.IncludeProperties(x => x.FirstName);

            if (!string.IsNullOrEmpty(model.LastName))
                options.IncludeProperties(x => x.LastName);

            if (!string.IsNullOrEmpty(model.Username))
                options.IncludeProperties(x => x.Username);

            if (!string.IsNullOrEmpty(model.ContactUrl))
                options.IncludeProperties(x => x.ContactUrl);

            if (model.Photo is not null)
                options.IncludeProperties(x => x.Photo);
        });
}