using BS.Core.Models.User;
using BS.IntegrationTests.Extensions;

namespace BS.IntegrationTests.Endpoints;

public static class UserEndpoints
{
    public static async Task<UserData> EditUserProfile(HttpClient client, EditProfileModel model)
    {
        var content = new MultipartFormDataContent {
            { new StringContent(model.FirstName!), "FirstName" },
            { new StringContent(model.LastName!), "LastName" },
            { new StringContent(model.Username!), "Username" },
            { new StringContent(model.ContactUrl!), "ContactUrl" },
        };
        
        return await client.TestPostAsync<UserData>("/Users/editProfile", content);
    }
    
    public static async Task<UserData> GetUserData(HttpClient client) => 
        await client.TestGetAsync<UserData>("/Users/me");
    
    public static Task<UserProfile[]> SearchByUsernamePrefix(HttpClient client, string usernamePrefix) => 
        client.TestGetAsync<UserProfile[]>($"/Users/search/{usernamePrefix}");
}