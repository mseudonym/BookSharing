using System.Net.Http.Headers;
using BS.Api.Requests;
using Microsoft.AspNetCore.Http;

namespace BS.IntegrationTests.DataGenerator;

public static class BookGenerator
{
    public static AddBookRequest CreateValidBookRequest(string? title = null)
    {
        var stream = new MemoryStream(new byte[] { 1, 2, 3, 4 });
        var formFile = new FormFile(stream, 0, stream.Length, "BookCover", "cover.jpg")
        {
            Headers = new HeaderDictionary(),
            ContentType = "image/jpeg"
        };
        return new AddBookRequest
        {
            Title = title ?? "Test Book " + Guid.NewGuid(),
            Author = "Test Author",
            Description = "Test Description",
            Isbn = Guid.NewGuid().ToString(),
            Language = "en",
            PublicationYear = 2024,
            BookCover = formFile
        };
    }

    public static MultipartFormDataContent ToFormDataContent(this AddBookRequest request)
    {
        var content = new MultipartFormDataContent();
        content.Add(new StringContent(request.Title), nameof(request.Title));
        content.Add(new StringContent(request.Author), nameof(request.Author));
        content.Add(new StringContent(request.Description), nameof(request.Description));
        if (request.Isbn != null)
            content.Add(new StringContent(request.Isbn), nameof(request.Isbn));
        content.Add(new StringContent(request.Language), nameof(request.Language));
        if (request.PublicationYear.HasValue)
            content.Add(new StringContent(request.PublicationYear.Value.ToString()), nameof(request.PublicationYear));
        // BookCover
        var fileContent = new StreamContent(request.BookCover.OpenReadStream());
        fileContent.Headers.ContentType = new MediaTypeHeaderValue(request.BookCover.ContentType);
        content.Add(fileContent, nameof(request.BookCover), request.BookCover.FileName);
        return content;
    }
} 