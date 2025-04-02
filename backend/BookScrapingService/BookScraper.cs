using System.Text.RegularExpressions;
using AngleSharp;
using AngleSharp.Dom;
using AngleSharp.Html.Dom;

namespace BookScrapingService;

public static partial class BookScraper
{
    private const string BookTitleSelector = "p[class='lnjchu-1 hhskLb']";
    private const string BookAuthorSelector = "div[class='dey4wx-1 jVKkXg']";
    private const string BookDescriptionSelector = "p[class='lnjchu-1 dPgoNf']";
    private const string BookISBNSelector = "script[name='shemaOrgSeo']";

    private const string BookCoverPattern = "book_covers.+?.(jpg|jpeg)";
    private const string DefaultBookCoverFileName = "default.jpg";
    private const string BookLinkPattern = "author/(.+?)/(.+?)";
    private const string MetaDescriptionPattern = """<meta\s+name="description"\s+content="(.*?)"/>""";

    private const string ISBNPattern1 = @"ISBN:\s*(?=\d)(\d{13}|\d{9}[\d|X])";

    private const string ISBNPattern2 = """
                                        "isbn":"(\d{13}|\d{9}[\d|X])"
                                        """;

    private static readonly Regex BookCoverFromHtml = BookCoverRegex();

    public static async Task<BookInfo?> GetBookInfoOrNullAsync(string bookName)
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
        var isbn = await GetISBNByBookLinkOrNullAsync(bookLink);
        if (isbn is null)
            return null;

        var bookCoverId = await DownloadBookCoverOrGetDefaultAsync(htmlContent);

        return new BookInfo
        {
            Title = bookTitle,
            Author = author,
            Description = description,
            BookCoverId = bookCoverId,
            ISBN = isbn
        };
    }

    private static async Task<string?> GetISBNByBookLinkOrNullAsync(string? bookLink)
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

        var isbn = GetISBNByMetaOrNull(htmlContent);
        if (isbn is not null)
            return isbn;

        isbn = await GetISBNByScriptOrNullAsync(htmlContent);
        if (isbn is null)
            Console.WriteLine("ISBN is null.");
        return isbn;
    }

    private static string? GetISBNByMetaOrNull(string htmlContent)
    {
        Match match = MetaDescriptionRegex().Match(htmlContent);

        if (!match.Success)
        {
            return null;
        }

        var descriptionContent = match.Groups[1].Value; // Извлекаем содержимое атрибута content
        match = ISBNRegex1().Match(descriptionContent);
        return match.Success ? match.Groups[1].Value : null;
    }

    private static async Task<string?> GetISBNByScriptOrNullAsync(string htmlContent)
    {
        var config = Configuration.Default.WithDefaultLoader();
        var context = BrowsingContext.New(config);
        var document = await context.OpenAsync(req => req.Content(htmlContent));
        var script = document.QuerySelector(BookISBNSelector);

        var textContent = script?.TextContent;
        if (textContent is null)
        {
            return null;
        }

        var match = ISBNRegex2().Match(textContent);
        return match.Success ? match.Groups[1].Value : null;
    }

    private static string? GetBookLinkOrNull(IDocument document)
    {
        var anchors = document.QuerySelectorAll("a").OfType<IHtmlAnchorElement>();
        return anchors
            .Select(a => a.GetAttribute("href"))
            .FirstOrDefault(href => href != null && BookLinkRegex().IsMatch(href));
    }

    private static async Task<string> DownloadBookCoverOrGetDefaultAsync(string htmlContent)
    {
        var bookCoverId = DefaultBookCoverFileName;

        if (!BookCoverFromHtml.IsMatch(htmlContent))
            return bookCoverId;

        bookCoverId = BookCoverFromHtml.Match(htmlContent).Value;
        var fullPath = GetFullPath(bookCoverId);
        if (File.Exists(fullPath))
            return bookCoverId;

        var imageBytes = await MyBookClient.GetBookCoverOrNullAsync(bookCoverId);
        if (imageBytes is null)
            return DefaultBookCoverFileName;

        await WriteInFileBookCoverAsync(fullPath, imageBytes);
        return bookCoverId;
    }

    private static string GetFullPath(string bookCoverId) =>
        Path.Combine(AppDomain.CurrentDomain.BaseDirectory, bookCoverId.Trim().Split('/').Last());

    public static async Task<ICollection<BookInfo>> GetBookInfos(IEnumerable<string> booksArray)
    {
        var infos = new HashSet<BookInfo>();
        foreach (var book in booksArray)
        {
            var bookInfo = await GetBookInfoOrNullAsync(book);
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

    private static async Task WriteInFileBookCoverAsync(string fullPath, byte[] imageBytes)
    {
        await File.WriteAllBytesAsync(fullPath, imageBytes);
    }

    [GeneratedRegex(BookCoverPattern, RegexOptions.IgnoreCase)]
    private static partial Regex BookCoverRegex();

    [GeneratedRegex(BookLinkPattern)]
    private static partial Regex BookLinkRegex();

    [GeneratedRegex(ISBNPattern1)]
    private static partial Regex ISBNRegex1();

    [GeneratedRegex(ISBNPattern2)]
    private static partial Regex ISBNRegex2();

    [GeneratedRegex(MetaDescriptionPattern)]
    private static partial Regex MetaDescriptionRegex();
}