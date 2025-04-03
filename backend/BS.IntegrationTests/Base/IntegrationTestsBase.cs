using BS.IntegrationTests.Endpoints;

namespace BS.IntegrationTests.Base;

public abstract class IntegrationTestsBase
{
    private readonly TestWebApplicationFactory _webApplicationFactory = new();
    public HttpClient GetClient() => _webApplicationFactory.CreateClient();

    public async Task<HttpClient> GetAuthClient()
    {
        var client = GetClient();

        await AuthEndpoints.RegisterAndLogin(client);

        return client;
    }
}