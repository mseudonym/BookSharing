using BS.IntegrationTests.Base;
using BS.IntegrationTests.Endpoints;
using Shouldly;

namespace BS.IntegrationTests.EndpointsTests;

public class UserTests : IntegrationTestsBase
{
    [Test]
    public async Task UserRegistrationFlow_WorkCorrect()
    {
        // Arrange
        var client = GetClient();
        var editProfileModel = GenerateEditProfileModel();

        // Act
        await AuthEndpoints.RegisterAndLogin(client);
        await UserEndpoints.EditUserProfile(client, editProfileModel);
        
        // Assert
        var userData = await UserEndpoints.GetUserData(client);

        userData.FirstName.ShouldBe(editProfileModel.FirstName);
        userData.LastName.ShouldBe(editProfileModel.LastName);
        userData.Username.ShouldBe(editProfileModel.Username);
        userData.ContactUrl.ShouldBe(editProfileModel.ContactUrl);
        userData.IsProfileFilled.ShouldBeTrue();
    }

    [Test]
    public async Task UserSearchByUsername_ReturnCorrectUsernames()
    {
        // Arrange
        var prefix = GenerateRandomUsernamePrefix();
        var usernames = new[] { "ABC", "Abd", "a_zz", "A_ss", "a2zz" }
            .Select(suffix => prefix + suffix)
            .ToArray();

        foreach (var username in usernames)
        {
            var newUserClient = await GetAuthClient();

            var editProfileModel = GenerateEditProfileModel() with { Username = username };
            await UserEndpoints.EditUserProfile(newUserClient, editProfileModel);
        }

        var client = await GetAuthClient();

        // Act
        var search1 = await UserEndpoints.SearchByUsernamePrefix(client, prefix + "a");
        var search2 = await UserEndpoints.SearchByUsernamePrefix(client, prefix + "A_");

        // Assert
        search1.Length.ShouldBe(3);
        search1.Select(u => u.Username).ShouldBeSubsetOf(usernames);
        search2.Length.ShouldBe(2);
        search2.Select(u => u.Username.Replace(prefix, "")).ShouldBeSubsetOf(["a_zz", "A_ss"]);
    }
}