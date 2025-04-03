using System.Net.Http.Headers;
using System.Net.Http.Json;
using BS.IntegrationTests.Extensions;
using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.AspNetCore.Identity.Data;

namespace BS.IntegrationTests.Endpoints;

public class AuthEndpoints
{
    public static async Task<RegisterRequest> RegisterAndLogin(HttpClient client)
    {
        var registerRequest = await Register(client);

        var loginRequest = new LoginRequest { Email = registerRequest.Email, Password = registerRequest.Password };
        var accessTokenResponse = await Login(client, loginRequest);

        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", accessTokenResponse.AccessToken);
        
        return registerRequest;
    }

    public static async Task<AccessTokenResponse> Login(HttpClient client, LoginRequest loginRequest)
    {
        var accessTokenResponse = await client.PostAsync<AccessTokenResponse>(
            "/Auth/login",
            JsonContent.Create(loginRequest)
        );
        return accessTokenResponse;
    }

    public static async Task<RegisterRequest> Register(HttpClient client)
    {
        var user = GenerateRegisterRequest();
        await HttpClientExtensions.PostAsync(client, "/Auth/register", JsonContent.Create(user));
        return user;
    }
}