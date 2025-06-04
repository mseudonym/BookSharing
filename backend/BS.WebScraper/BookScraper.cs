using System.Text.RegularExpressions;
using AngleSharp;
using AngleSharp.Dom;
using AngleSharp.Html.Dom;
using BS.Core.Extensions;
using BS.Core.Models.Book;
using BS.Core.Services.Book;

namespace BS.WebScraper;

public static partial class BookScraper
{
    private const string BookTitleSelector = "p[class='lnjchu-1 hhskLb']";
    private const string BookAuthorSelector = "div[class='dey4wx-1 jVKkXg']";
    private const string BookDescriptionSelector = "p[class='lnjchu-1 dPgoNf']";
    private const string BookIsbnSelector = "script[name='shemaOrgSeo']";

    private const string BookCoverPattern = "book_covers.+?.(jpg|jpeg)";
    private const string DefaultBookCoverFileName = "default.jpg";
    private const string BookLinkPattern = "author/(.+?)/(.+?)";
    private const string MetaDescriptionPattern = """<meta\s+name="description"\s+content="(.*?)"/>""";

    private const string IsbnPattern1 = @"ISBN:\s*(?=\d)(\d{13}|\d{9}[\d|X])";

    private const string IsbnPattern2 = """
                                        "isbn":"(\d{13}|\d{9}[\d|X])"
                                        """;

    private static readonly Regex BookCoverFromHtml = BookCoverRegex();

    public static async Task<BookModel?> GetBookInfoOrNullAsync(IBookService bookService, string bookName)
    {
        var response = await MyBookClient.GetSearchResultAsync(bookName);
        if (response is not { IsSuccessStatusCode: true })
        {
            Console.WriteLine($"Failed to get book info for '{bookName}'.");
            return null;
        }

        var htmlContent = await response.Content.ReadAsStringAsync();
        var config = Configuration.Default.WithDefaultLoader();
        var context = BrowsingContext.New(config);
        var document = await context.OpenAsync(req => req.Content(htmlContent));

        var bookTitle = GetTextContentOrNull(document.QuerySelector(BookTitleSelector));
        if (bookTitle is null)
        {
            Console.WriteLine($"The book '{bookName}' not found.");
            return null;
        }

        var author = GetTextContentOrNull(document.QuerySelector(BookAuthorSelector));
        var description = GetTextContentOrNull(document.QuerySelector(BookDescriptionSelector));
        var bookLink = GetBookLinkOrNull(document);
        var isbn = await GetIsbnByBookLinkOrNullAsync(bookLink);
        if (isbn is null)
            return null;

        var (_, coverFile) = await GetBookCoverOrDefaultAsync(htmlContent);

        if (coverFile is null)
        {
            Console.WriteLine("Cover form file is null.");
            return null;
        }

        var addBookModel = new AddBookModel
        {
            Author = author ?? "Unknown author",
            BookCover = coverFile.GetPhotoFileModel(),
            Description = description ?? "~~~",
            Isbn = isbn,
            Language = "RUS",
            Title = bookTitle,
            PublicationYear = null,
        };
        var res = await bookService.AddBookAsync(addBookModel);
        return res.IsSuccess ? res.Value : null;
    }

    private static async Task<string?> GetIsbnByBookLinkOrNullAsync(string? bookLink)
    {
        if (bookLink is null)
        {
            Console.WriteLine("Book link was null.");
            return null;
        }

        var htmlContent = await MyBookClient.GetBookInfoAsync(bookLink);
        if (htmlContent is null)
        {
            Console.WriteLine($"Failed to get book info for '{bookLink}'.");
            return null;
        }

        var isbn = GetIsbnByMetaOrNull(htmlContent);
        if (isbn is not null)
            return isbn;

        isbn = await GetIsbnByScriptOrNullAsync(htmlContent);
        if (isbn is null)
            Console.WriteLine("ISBN is null.");
        return isbn;
    }

    private static string? GetIsbnByMetaOrNull(string htmlContent)
    {
        var match = MetaDescriptionRegex().Match(htmlContent);

        if (!match.Success) return null;

        var descriptionContent = match.Groups[1].Value; // Извлекаем содержимое атрибута content
        match = IsbnRegex1().Match(descriptionContent);
        return match.Success ? match.Groups[1].Value : null;
    }

    private static async Task<string?> GetIsbnByScriptOrNullAsync(string htmlContent)
    {
        var config = Configuration.Default.WithDefaultLoader();
        var context = BrowsingContext.New(config);
        var document = await context.OpenAsync(req => req.Content(htmlContent));
        var script = document.QuerySelector(BookIsbnSelector);

        var textContent = script?.TextContent;
        if (textContent is null) return null;

        var match = IsbnRegex2().Match(textContent);
        return match.Success ? match.Groups[1].Value : null;
    }

    private static string? GetBookLinkOrNull(IDocument document)
    {
        var anchors = document.QuerySelectorAll("a").OfType<IHtmlAnchorElement>();
        return anchors
            .Select(a => a.GetAttribute("href"))
            .FirstOrDefault(href => href != null && BookLinkRegex().IsMatch(href));
    }

    private static async Task<(string BookCover, IFormFile? coverFile)> GetBookCoverOrDefaultAsync(string htmlContent)
    {
        var bookCoverId = DefaultBookCoverFileName;

        if (!BookCoverFromHtml.IsMatch(htmlContent))
            return (bookCoverId, null);

        bookCoverId = BookCoverFromHtml.Match(htmlContent).Value;

        var imageBytes = await MyBookClient.GetBookCoverOrNullAsync(bookCoverId);
        if (imageBytes is null)
            return (DefaultBookCoverFileName, null);

        var stream = new MemoryStream(imageBytes);
        var file = new FormFile(
            stream,
            baseStreamOffset: 0,
            imageBytes.Length,
            name: bookCoverId,
            fileName: $"{bookCoverId}.jpg");
        // file.ContentType = "image/jpeg";
        return (bookCoverId, file);
    }

    public static async Task<ICollection<BookModel>> GetBookInfos(
        IBookService bookService, IEnumerable<string> booksArray)
    {
        var infos = new HashSet<BookModel>();
        foreach (var book in booksArray)
        {
            var bookInfo = await GetBookInfoOrNullAsync(bookService, book);
            if (bookInfo != null)
                infos.Add(bookInfo);
        }

        return infos;
    }

    private static string? GetTextContentOrNull(IElement? element)
    {
        if (element == null || string.IsNullOrWhiteSpace(element.TextContent))
            return null;
        return element.TextContent;
    }

    [GeneratedRegex(BookCoverPattern, RegexOptions.IgnoreCase)]
    private static partial Regex BookCoverRegex();

    [GeneratedRegex(BookLinkPattern)]
    private static partial Regex BookLinkRegex();

    [GeneratedRegex(IsbnPattern1)]
    private static partial Regex IsbnRegex1();

    [GeneratedRegex(IsbnPattern2)]
    private static partial Regex IsbnRegex2();

    [GeneratedRegex(MetaDescriptionPattern)]
    private static partial Regex MetaDescriptionRegex();
}