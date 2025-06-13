using BS.Core.Models.User;
using BS.IntegrationTests.Extensions;

namespace BS.IntegrationTests.Endpoints;

public static class FriendsEndpoints
{
    public static async Task<UserProfile[]> GetFriends(HttpClient client)
        => await client.GetAsync<UserProfile[]>("/Friends/list");

    public static async Task SendFriendRequest(HttpClient client, Guid personToSendId)
        => await client.PostAsync($"/Friends/sendRequest?personToSendId={personToSendId}", null!);

    public static async Task CancelFriendRequest(HttpClient client, Guid person)
        => await client.PostAsync($"/Friends/cancelRequest?person={person}", null!);

    public static async Task RespondToFriendRequest(HttpClient client, Guid personToRespondId, bool isAccepted)
        => await client.PostAsync($"/Friends/respondRequest?personToRespondId={personToRespondId}&isAccepted={isAccepted.ToString().ToLower()}", null!);

    public static async Task<UserProfile[]> GetSentFriendRequests(HttpClient client)
        => await client.GetAsync<UserProfile[]>("/Friends/requests/sent");

    public static async Task<UserProfile[]> GetReceivedFriendRequests(HttpClient client)
        => await client.GetAsync<UserProfile[]>("/Friends/requests/received");

    public static async Task DeleteFriend(HttpClient client, Guid personToDeleteId)
        => await client.DeleteAsync($"/Friends/delete?personToDeleteId={personToDeleteId}");

    public static async Task<HttpResponseMessage> SendFriendRequestRaw(HttpClient client, Guid personToSendId)
        => await client.PostAsync($"/Friends/sendRequest?personToSendId={personToSendId}", null!);

    public static async Task<HttpResponseMessage> RespondToFriendRequestRaw(HttpClient client, Guid personToRespondId, bool isAccepted)
        => await client.PostAsync($"/Friends/respondRequest?personToRespondId={personToRespondId}&isAccepted={isAccepted.ToString().ToLower()}", null!);
}
