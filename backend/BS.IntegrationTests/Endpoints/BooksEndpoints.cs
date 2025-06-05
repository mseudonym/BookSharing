using BS.Core.Models.Book;
using BS.IntegrationTests.Extensions;
using BS.Api.Requests;
using System.Net.Http.Json;
using BS.IntegrationTests.DataGenerator;

namespace BS.IntegrationTests.Endpoints;

public static class BooksEndpoints
{
    public static async Task<Guid> AddBook(HttpClient client, AddBookRequest request)
    {
        var response = await client.PostAsync("/Books/add", request.ToFormDataContent());
        var book = await response.Content.ReadFromJsonAsync<BookModel>();
        return book!.Id;
    }
} 