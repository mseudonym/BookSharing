using BS.Core.Models.Book;
using FluentValidation;
using static BS.Data.Validations.DataBookValidationConstants;

namespace BS.Core.Validations;

public class AddBookModelValidator : AbstractValidator<AddBookModel>
{
    public AddBookModelValidator()
    {
        RuleFor(model => model.Author)
            .NotEmpty()
            .MaximumLength(AuthorMaxLength);

        RuleFor(model => model.Title)
            .NotEmpty()
            .MaximumLength(TitleMaxLength);

        RuleFor(model => model.Description)
            .NotEmpty()
            .MaximumLength(DescriptionMaxLength);

        RuleFor(model => model.PublicationYear)
            .GreaterThan(0)
            .LessThanOrEqualTo(DateTime.Now.Year)
            .When(model => model.PublicationYear.HasValue);

        RuleFor(model => model.Isbn)
            .SetValidator(new IsbnValidator());
        
        RuleFor(model => model.Language)
            .NotEmpty()
            .MaximumLength(LanguageMaxLength)
            .When(model => !string.IsNullOrEmpty(model.Language));
        
        RuleFor(model => model.BookCover)
            .SetValidator(new PhotoFileModelValidator());
    }
}