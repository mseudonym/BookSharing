using System.Net.Mime;
using BS.Api.Requests;
using BS.Core.Extensions;
using BS.Core.Models.Book;
using BS.Core.Services.Book;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using static BS.Api.Results.ErrorStatusCodeMapper;

namespace BS.Api.Controllers;

[Authorize]
[Route("[controller]")]
[ApiController]
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

        return MapResult(result);
    }

    [HttpGet("byTitle/{title}")]
    public async Task<ActionResult<BookModel[]>> GetBookByTitle([FromRoute] string title)
    {
        var result = await _bookService.GetBooksByTitleAsync(title);
        return MapResult(result);
    }

    [HttpGet("byIsbn/{isbn}")]
    [ProducesResponseType(typeof(BookModel), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BookModel>> GetBookByIsbn([FromRoute] string isbn)
    {
        var result = await _bookService.GetBookByIsbnAsync(isbn);
        return MapResult(result);
    }

    [HttpPost("add")]
    [Consumes(MediaTypeNames.Multipart.FormData)]
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
            BookCover = bookRequest.BookCover!.GetPhotoFileModel(),
        };
        var addResult = await _bookService.AddBookAsync(model);
        return MapResult(addResult);
    }

    [HttpGet("allFriendsBooks")]
    public async Task<ActionResult<BookModel[]>> GetAllFriendsBooksAsync()
    {
        var result = await _bookService.GetAllFriendsBooks();
        return MapResult(result);
    }

    [HttpGet("friendBooks")]
    public async Task<ActionResult<BookModel[]>> GetFriendBooks(Guid friendId)
    {
        var result = await _bookService.GetFriendBooks(friendId);
        return MapResult(result);
    }

    [HttpGet("myBooks")]
    public async Task<ActionResult<BookModel[]>> GetMyBooks()
    {
        var result = await _bookService.GetMyBooks();
        return MapResult(result);
    }
}