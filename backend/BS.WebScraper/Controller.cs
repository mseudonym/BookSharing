using System.Text.RegularExpressions;
using BS.Core.Services.Book;
using Microsoft.AspNetCore.Mvc;

namespace BS.WebScraper;

[ApiController]
[Route("api/[controller]")]
public class ScrapeController : ControllerBase
{
    private const string FileName = "book_titles.txt";
    private const string BookNamesFromTxtFile = @"^\d+\.\s*(.*)$";
    private static readonly Regex Regex = new(BookNamesFromTxtFile);
    private readonly IBookService _bookService;

    public ScrapeController(IBookService bookService)
    {
        _bookService = bookService;
    }

    [HttpPost("loadBooks")]
    public async Task<IActionResult> LoadBooks()
    {
        var bookNames = ParseBookNamesFromFile();
        var books = await BookScraper.GetBookInfos(_bookService, bookNames);
        foreach (var bookInfo in books) Console.WriteLine(bookInfo);

        Console.WriteLine($"Total count: {books.Count}.");
        return books.Any() ? Ok(books) : NotFound();
    }

    [HttpPost("loadBook/{title}")]
    public async Task<IActionResult> LoadBook(string title)
    {
        if (string.IsNullOrEmpty(title))
            return BadRequest();
        var book = await BookScraper.GetBookInfoOrNullAsync(_bookService, title);

        return book != null ? Ok(book) : NotFound();
    }

    private static string[] ParseBookNamesFromFile()
    {
        var bookNames = new List<string>();
        var fullPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, $@"..\..\..\{FileName}");
        // var fullPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, FileName);
        if (System.IO.File.Exists(fullPath))
            try
            {
                var lines = System.IO.File.ReadAllLines(fullPath);

                foreach (var line in lines)
                {
                    var match = Regex.Match(line.Trim());

                    if (match.Success) bookNames.Add(match.Groups[1].Value);
                }

                return bookNames.ToArray();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error reading the file: {ex.Message}");
            }
        else
            Console.WriteLine($"The file {fullPath} does not exist.");

        return [];
    }
}