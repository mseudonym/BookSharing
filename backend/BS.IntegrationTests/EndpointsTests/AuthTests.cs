using System.Net;
using BS.IntegrationTests.Base;
using BS.IntegrationTests.Endpoints;
using Microsoft.AspNetCore.Identity.Data;

namespace BS.IntegrationTests.EndpointsTests;

public class AuthTests : IntegrationTestsBase
{
    [Test]
    public async Task LoginWorkOnlyByEmail()
    {
        // Arrange
        var client = GetClient();
        var registerRequest = await AuthEndpoints.RegisterAndLogin(client);
        var editProfileModel = GenerateEditProfileModel();
        await UserEndpoints.EditUserProfile(client, editProfileModel);

        var password = registerRequest.Password;
        var loginByEmailModel = new LoginRequest { Email = registerRequest.Email, Password = password };
        var loginByUsernameModel = new LoginRequest { Email = editProfileModel.Username!, Password = password };

        // Arrange
        await AuthEndpoints.Login(client, loginByEmailModel);
        AssertReturnCode(HttpStatusCode.Unauthorized, AuthEndpoints.Login(client, loginByUsernameModel));
    }
}