using BS.Core.Errors;
using BS.Core.Errors.Validation;
using BS.Core.Extensions;
using BS.Core.Models.Book;
using BS.Core.Models.Mapping;
using BS.Core.Services.Items;
using BS.Core.Services.S3;
using BS.Core.Services.User;
using BS.Core.Validations;
using BS.Data.Context;
using BS.Data.Entities;
using FluentResults;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace BS.Core.Services.Book;

public class BookService : IBookService
{
    private const int SearchByTitleBooksMaxCount = 10;

    private readonly IValidator<AddBookModel> _addBookModelValidator = new AddBookModelValidator();
    private readonly IValidator<string?> _isbnValidator = new IsbnValidator();
    private readonly BookMapper _bookMapper;
    private readonly TimeProvider _timeProvider;
    private readonly ICurrentUserService _currentUserService;
    private readonly BookSharingContext _dbContext;
    private readonly IS3Service _s3Service;
    private readonly IItemService _itemService;

    public BookService(
        BookSharingContext dbContext,
        ICurrentUserService currentUserService,
        IS3Service s3Service,
        BookMapper bookMapper,
        TimeProvider timeProvider,
        IItemService itemService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
        _s3Service = s3Service;
        _bookMapper = bookMapper;
        _timeProvider = timeProvider;
        _itemService = itemService;
    }

    public async Task<Result<BookModel[]>> GetBooksByTitleAsync(string bookName)
    {
        if (string.IsNullOrWhiteSpace(bookName))
            return Result.Fail(new ValidationError("TitleIsEmpty", "Book title cannot be empty."));
        var books = await _dbContext.Books
            .Where(b => b.Title.ToLower().Contains(bookName.ToLower()))
            .Take(SearchByTitleBooksMaxCount)
            .ToListAsync();
        return books.Count == 0
            ? Result.Fail(BookNotFoundError.ByTitle(bookName))
            : Result.Ok(books.Select(b => _bookMapper.ToBookModel(b)).ToArray());
    }

    public async Task<Result<BookModel>> GetBookByIsbnAsync(string isbn)
    {
        var validationResult = await _isbnValidator.ValidateAsync(isbn).ToTypedResult();
        if (validationResult.IsFailed)
            return validationResult;

        var book = await _dbContext.Books.FirstOrDefaultAsync(b => b.Isbn == isbn);
        return book is null
            ? Result.Fail(BookNotFoundError.ByIsbn(isbn))
            : Result.Ok(_bookMapper.ToBookModel(book));
    }

    public async Task<Result<BookModel>> GetBookByIdAsync(Guid bookId)
    {
        var book = await _dbContext.Books.FirstOrDefaultAsync(b => b.Id == bookId);

        return book is null
            ? Result.Fail<BookModel>(BookNotFoundError.ById(bookId))
            : Result.Ok(_bookMapper.ToBookModel(book));
    }

    public async Task<Result<BookModel>> AddBookAsync(AddBookModel book)
    {
        var validationResult = await _addBookModelValidator.ValidateAsync(book).ToTypedResult();
        if (validationResult.IsFailed)
            return validationResult;

        var currentUserId = await _currentUserService.GetIdAsync();

        if (book.Isbn != null && await _dbContext.Books.AnyAsync(b => b.Isbn == book.Isbn))
            return Result.Fail<BookModel>(new ValidationError("BookWithThatIsbnAlreadyExist",
                $"Book with ISBN '{book.Isbn}' already added."));

        var bookId = Guid.CreateVersion7();
        var uploadResult = await _s3Service.UploadBookCoverAsync(book.BookCover, bookId);

        if (uploadResult.IsFailed)
            return Result.Fail<BookModel>(uploadResult.Errors);

        await _dbContext.Books.AddAsync(new BookEntity
        {
            Id = bookId,
            Title = book.Title,
            Author = book.Author,
            Description = book.Description,
            Isbn = book.Isbn,
            Language = book.Language,
            PublicationYear = book.PublicationYear,
            IsPhotoUploaded = true,
            IsAddedByUser = true,
        });
        
        await _dbContext.SaveChangesAsync();
        
        await _itemService.AddToMyShelf(bookId);

        return await GetBookByIdAsync(bookId);
    }

    public async Task<Result> DeleteBookAsync(Guid bookId)
    {
        await _dbContext.Items
            .Where(item => item.BookId == bookId)
            .ExecuteDeleteAsync();

        return Result.Ok();
    }

    public async Task<Result<BookModel[]>> GetAllFriendsBooks()
    {
        var currentUserId = await _currentUserService.GetIdAsync();
        var currentUserWithFriendsAndTheirBooks = await _dbContext.Users
            .Where(user => user.Id == currentUserId)
            .Include(user => user.Friends)
            .ThenInclude(friend => friend.Items)
            .ThenInclude(item => item.Book)
            .FirstAsync();

        var books = currentUserWithFriendsAndTheirBooks.Friends
            .SelectMany(friend => friend.Items)
            .OrderByDescending(item => item.CreatedUtc)
            .Select(item => item.Book)
            .DistinctBy(book => book.Id)
            .Select(book => _bookMapper.ToBookModel(book))
            .ToArray();

        return books;
    }

    public async Task<Result<BookModel[]>> GetFriendBooks(Guid friendId)
    {
        var currentUserId = await _currentUserService.GetIdAsync();

        var friend = await _dbContext.Users
            .Where(user => user.Id == friendId)
            .Include(user => user.Friends)
            .Include(user => user.Items)
            .ThenInclude(item => item.Book)
            .FirstOrDefaultAsync();

        if (friend is null) return Result.Fail(new PersonNotFoundError(friendId));

        if (friend.Friends.All(f => f.Id != currentUserId))
            return Result.Fail(new PersonIsNotYourFriendError(friendId));
        return friend.Items
            .Select(item => _bookMapper
                .ToBookModel(item.Book))
            .ToArray();
    }

    public async Task<Result<BookModel[]>> GetMyBooks()
    {
        var currentUserId = await _currentUserService.GetIdAsync();
        var currentUser = await _dbContext.Users
            .Where(user => user.Id == currentUserId)
            .Include(user => user.Items)
            .ThenInclude(item => item.Book)
            .FirstAsync();
        return currentUser.Items.Select(item => _bookMapper.ToBookModel(item.Book)).ToArray();
    }
}