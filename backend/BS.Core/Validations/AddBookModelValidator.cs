using BS.Core.Models.Book;
using FluentValidation;
using static BS.Data.Validations.DataBookValidationConstants;

namespace BS.Core.Validations;

public class AddBookModelValidator : AbstractValidator<AddBookModel>
{
    public AddBookModelValidator()
    {
        RuleFor(model => model.Author)
            .NotNull()
            .NotEmpty()
            .MaximumLength(AuthorMaxLength);

        RuleFor(model => model.Title)
            .NotNull()
            .NotEmpty()
            .MaximumLength(TitleMaxLength);

        RuleFor(model => model.Description)
            .NotNull()
            .NotEmpty()
            .MaximumLength(DescriptionMaxLength);

        RuleFor(model => model.PublicationYear)
            .GreaterThan(0)
            .LessThanOrEqualTo(DateTime.Now.Year)
            .When(model => model.PublicationYear.HasValue);

        RuleFor(model => model.Isbn)
            .NotEmpty()
            .Matches(@"^\d{3}-\d{1,5}-\d{1,7}-\d{1,7}-\d{1}$")
            .When(model => !string.IsNullOrEmpty(model.Isbn));

        RuleFor(model => model.Language)
            .NotEmpty()
            .MaximumLength(LanguageMaxLength)
            .When(model => !string.IsNullOrEmpty(model.Language));
    }
}