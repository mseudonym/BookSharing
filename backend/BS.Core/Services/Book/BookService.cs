using BS.Core.Errors;
using BS.Core.Errors.Book;
using BS.Core.Extensions;
using BS.Core.Models.Book;
using BS.Core.Models.Mapping;
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
    private readonly BookSharingContext _dbContext;
    private readonly ICurrentUserService _currentUserService;
    private readonly IS3Service _s3Service;
    private readonly BookMapper _bookMapper;

    private readonly IValidator<AddBookModel> _addBookModelValidator = new AddBookModelValidator();

    public BookService(
        BookSharingContext dbContext,
        ICurrentUserService currentUserService,
        IS3Service s3Service,
        BookMapper bookMapper)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
        _s3Service = s3Service;
        _bookMapper = bookMapper;
    }

    public async Task<Result<IEnumerable<BookModel>>> GetBooksByTitleAsync(string bookName)
    {
        if (string.IsNullOrWhiteSpace(bookName))
            return Result.Fail(new EmptyTitleError());
        var books = await _dbContext.Books
            .Where(b => b.Title.ToLower().Contains(bookName.ToLower()))
            .Take(SearchByTitleBooksMaxCount)
            .ToListAsync();
        return books.Count == 0
            ? Result.Fail<IEnumerable<BookModel>>(new BookNotFoundByTitleError(bookName))
            : Result.Ok(books.Select(b => _bookMapper.ToBookModel(b)));
    }

    public async Task<Result<BookModel>> GetBookByIsbnAsync(string isbn)
    {
        if (string.IsNullOrWhiteSpace(isbn) || !isbn.IsValidIsbn(out var validIsbn))
        {
            return Result.Fail<BookModel>(new InvalidIsbnError(isbn));
        }

        var book = await _dbContext.Books.Where(b => b.Isbn == validIsbn).FirstOrDefaultAsync();
        return book is null
            ? Result.Fail<BookModel>(new BookNotFoundByIsbnError(validIsbn))
            : Result.Ok(_bookMapper.ToBookModel(book));
    }

    public async Task<Result<BookModel>> GetBookByIdAsync(Guid bookId)
    {
        var book = await _dbContext.Books
            .Where(b => b.Id == bookId).FirstOrDefaultAsync();
        return book is null
            ? Result.Fail<BookModel>(new BookNotFoundByIdError(bookId))
            : Result.Ok(_bookMapper.ToBookModel(book));
    }

    public async Task<Result<BookModel>> AddBookAsync(AddBookModel book)
    {
        var validationResult = await _addBookModelValidator.ValidateAsync(book);
        if (!validationResult.IsValid)
        {
            return Result.Fail<BookModel>(new ModelValidationError(validationResult.ErrorsToString()));
        }

        var currentUserId = await _currentUserService.GetIdAsync();

        if (book.Isbn != null && await _dbContext.Books.AnyAsync(b => b.Isbn == book.Isbn))
        {
            return Result.Fail<BookModel>(new BookAlreadyAddedError(book.Isbn));
        }

        var bookId = Guid.NewGuid();
        var isUploaded = false;
        if (book.BookCover != null)
        {
            var uploadResult = await _s3Service.UploadBookCoverAsync(book.BookCover, bookId);

            if (uploadResult.IsFailed)
            {
                return Result.Fail<BookModel>(uploadResult.Errors);
            }

            isUploaded = true;
        }

        await _dbContext.Items.AddAsync(new ItemEntity
        {
            Id = Guid.NewGuid(),
            BookId = bookId,
            OwnerId = currentUserId,
            HolderId = currentUserId,
            CreatedUtc = DateTime.UtcNow,
        });
        await _dbContext.Books.AddAsync(new BookEntity
        {
            Id = bookId,
            Title = book.Title,
            Author = book.Author,
            Description = book.Description,
            Isbn = book.Isbn,
            Language = book.Language,
            PublicationYear = book.PublicationYear,
            IsPhotoUploaded = isUploaded,
            IsAddedByUser = true
        });

        await _dbContext.SaveChangesAsync();

        return await GetBookByIdAsync(bookId);
    }

    public async Task<Result> DeleteBookAsync(Guid bookId)
    {
        var result = await _dbContext.Items
            .Where(item => item.BookId == bookId)
            .ExecuteDeleteAsync();
        return result is 0 or 1 ? Result.Ok() : Result.Fail(new BookDeleteError(result));
    }

    public async Task<Result<BookModel[]>> GetAllFriendsBooks()
    {
        var currentUserId = await _currentUserService.GetIdAsync();
        var currentUserWithFriendsAndTheirBooks = await _dbContext.Users
            .Where(user => user.Id == currentUserId)
            .Include(user => user.Friends)
            .ThenInclude(friend => friend.Items)
            .ThenInclude(item => item.Book)
            .FirstOrDefaultAsync();
        if (currentUserWithFriendsAndTheirBooks is null)
        {
            return Result.Fail(new FriendBooksNotFoundError());
        }
        
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

        if (friend is null)
        {
            return Result.Fail(new FriendNotFoundError(friendId));
        }

        if (friend.Friends.All(f => f.Id != currentUserId))
        {
            return Result.Fail(new PersonIsNotYourFriendError(friendId));
        }
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