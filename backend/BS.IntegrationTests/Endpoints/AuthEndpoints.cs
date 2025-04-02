using System.Net.Http.Headers;
using System.Net.Http.Json;
using BS.IntegrationTests.Extensions;
using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.AspNetCore.Identity.Data;

namespace BS.IntegrationTests.Endpoints;

public class AuthEndpoints
{
    public static async Task RegisterAndLoginUser(HttpClient client)
    {
        var user = await RegisterUser(client);

        var accessTokenResponse = await client.TestPostAsync<AccessTokenResponse>(
            "/Auth/login",
            JsonContent.Create(new LoginRequest { Email = user.Email, Password = user.Password })
        );

        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", accessTokenResponse.AccessToken);
    }

    private static async Task<RegisterRequest> RegisterUser(HttpClient client)
    {
        var user = GenerateRegisterRequest();
        await client.TestPostAsync("/Auth/register", JsonContent.Create(user));
        return user;
    }
}