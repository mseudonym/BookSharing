using BS.Api.Requests;
using BS.Core.Models.Book;
using BS.Core.Models.S3;
using BS.Core.Services.Book;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static BS.Api.Results.ErrorStatusCodeMapper;

namespace BS.Api.Controllers;

[Authorize]
[Route("[controller]")]
public class BooksController : Controller
{
    private readonly IBookService _bookService;

    public BooksController(IBookService bookService)
    {
        _bookService = bookService;
    }

    [HttpGet("byId/{bookId:guid}")]
    public async Task<ActionResult<BookModel>> GetBookById([FromRoute] Guid bookId)
    {
        var result = await _bookService.GetBookByIdAsync(bookId);

        return result.IsFailed ? MapResult(result) : Ok(result.Value);
    }

    [HttpGet("byTitle/{title}")]
    public async Task<ActionResult<BookModel[]>> GetBookByTitle([FromRoute] string title)
    {
        var result = await _bookService.GetBooksByTitleAsync(title);

        return result.IsFailed ? MapResult(result) : Ok(result.Value);
    }

    [HttpGet("byIsbn/{isbn}")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BookModel>> GetBookByIsbn([FromRoute] string isbn)
    {
        var result = await _bookService.GetBookByIsbnAsync(isbn);
        return result.IsFailed ? MapResult(result) : Ok(result.Value);
    }

    [HttpPost("add")]
    public async Task<ActionResult<BookModel>> AddBook([FromForm] AddBookRequest bookRequest)
    {
        var model = new AddBookModel
        {
            Title = bookRequest.Title,
            Author = bookRequest.Author,
            Description = bookRequest.Description,
            Isbn = bookRequest.Isbn,
            Language = bookRequest.Language,
            PublicationYear = bookRequest.PublicationYear,
            BookCover = bookRequest.BookCover is null
                ? null
                : bookRequest.BookCover!.GetPhotoFileModel(),
        };
        var addResult = await _bookService.AddBookAsync(model);
        return addResult.IsFailed ? MapResult(addResult) : Ok(addResult.Value);
    }

    [HttpGet("allFriendsBooks")]
    public async Task<ActionResult<BookModel[]>> GetAllFriendsBooksAsync()
    {
        var result = await _bookService.GetAllFriendsBooks();
        return result.IsFailed ? MapResult(result) : Ok(result.Value);
    }

    [HttpGet("friendBooks")]
    public async Task<ActionResult<BookModel[]>> GetFriendBooks(Guid friendId)
    {
        var result = await _bookService.GetFriendBooks(friendId);
        return result.IsFailed ? MapResult(result) : Ok(result.Value);
    }

    [HttpGet("myBooks")]
    public async Task<ActionResult<BookModel[]>> GetMyBooks()
    {
        var result = await _bookService.GetMyBooks();
        return result.IsFailed ? MapResult(result) : Ok(result.Value);
    }
}