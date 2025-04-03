using System.Text.Json;
using Shouldly;

namespace BS.IntegrationTests.Extensions;

public static class HttpClientExtensions
{
    private static readonly JsonSerializerOptions JsonSerializerOptions = new()
    {
        PropertyNameCaseInsensitive = true,
    };

    public static async Task<TResponse> PostAsync<TResponse>(this HttpClient client, string requestUri,
        HttpContent content)
        where TResponse : class
    {
        var response = await client.PostAsync(requestUri, content);

        await EnsureSuccessResponse(response);

        var resultInString = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<TResponse>(resultInString, JsonSerializerOptions);

        result.ShouldNotBeNull();

        return result;
    }

    public static async Task PostAsync(this HttpClient client, string requestUri, HttpContent content)
    {
        var response = await client.PostAsync(requestUri, content);

        await EnsureSuccessResponse(response);
    }

    private static async Task EnsureSuccessResponse(HttpResponseMessage response)
    {
        if (response.IsSuccessStatusCode) return;

        var content = await response.Content.ReadAsStringAsync();
        throw new HttpRequestException(
            "Response status is not success: " + response.StatusCode + "\n" + content,
            null,
            response.StatusCode
        );
    }

    public static async Task<T> GetAsync<T>(this HttpClient client, string requestUri)
        where T : class
    {
        var response = await client.GetAsync(requestUri);

        await EnsureSuccessResponse(response);

        var resultInString = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<T>(resultInString, JsonSerializerOptions);

        result.ShouldNotBeNull();

        return result;
    }
}