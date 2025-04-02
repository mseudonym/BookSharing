using FluentResults;
using BS.Core.Models.Book;

namespace BS.Core.Services.Book;

public interface IBookService
{
    public Task<Result<IEnumerable<BookModel>>> GetBooksByTitleAsync(string bookName);
    public Task<Result<BookModel>> GetBookByIsbnAsync(string isbn);
    public Task<Result<BookModel>> GetBookByIdAsync(Guid bookId);

    public Task<Result<BookModel>> AddBookAsync(AddBookModel book);
    public Task<Result> DeleteBookAsync(Guid bookId);
    public Task<Result<BookModel[]>> GetAllFriendsBooks();
    public Task<Result<BookModel[]>> GetFriendBooks(Guid friendId);
    public Task<Result<BookModel[]>> GetMyBooks();
}