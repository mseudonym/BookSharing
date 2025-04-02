namespace BookScrapingService;

public static class MyBookClient
{
    public static async Task<byte[]?> GetBookCoverOrNullAsync(string bookCoverJpgFileName)
    {
        using var client = new HttpClient();
        try
        {
            var imageBytes = await client.GetByteArrayAsync($"https://i1.mybook.io/p/x756/{bookCoverJpgFileName}");
            return imageBytes;
        }
        catch (HttpRequestException e)
        {
            Console.WriteLine($"Ошибка при выполнении запроса: {e.Message}");
            return null;
        }
    }

    public static async Task<HttpResponseMessage?> GetSearchResultAsync(string bookName)
    {
        using var client = new HttpClient();
        try
        {
            var response = await client.GetAsync($"https://mybook.ru/search/?q={bookName}");
            return response;
        }
        catch (HttpRequestException e)
        {
            Console.WriteLine($"Ошибка при выполнении запроса: {e.Message}");
            return null;
        }
    }

    public static async Task<string?> GetBookInfoAsync(string bookLink)
    {
        using var client = new HttpClient();
        try
        {
            var response = await client.GetStringAsync($"https://mybook.ru/{bookLink}");
            return response;
        }
        catch (HttpRequestException e)
        {
            Console.WriteLine($"Ошибка при выполнении запроса: {e.Message}");
            return null;
        }
    }
}