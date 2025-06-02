using BS.Core.Models.S3;
using BS.Core.Services.S3;
using FluentValidation;

namespace BS.Core.Validations;

public class PhotoFileModelValidator : AbstractValidator<PhotoFileModel>
{
    public PhotoFileModelValidator()
    {
        RuleFor(model => model.ContentType)
            .Equal(JpgFormat.ContentType)
            .WithMessage($"File type must be {JpgFormat.ContentType}")
            .WithErrorCode("NotSupportedType");
    }
}