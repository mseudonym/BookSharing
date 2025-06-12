using BS.Core.Models.Items;
using BS.IntegrationTests.Extensions;

namespace BS.IntegrationTests.Endpoints;

public static class ItemsEndpoints
{
    public static async Task<ItemInfo[]> GetMyItems(HttpClient client)
        => await client.GetAsync<ItemInfo[]>("/Items/my");

    public static async Task<ItemInfo[]> GetFriendsItems(HttpClient client)
        => await client.GetAsync<ItemInfo[]>("/Items/friends");

    public static async Task<ItemModel[]> GetFriendsItemsByBook(HttpClient client, Guid bookId)
        => await client.GetAsync<ItemModel[]>($"/Items/friendsByBook?bookId={bookId}");

    public static async Task<ItemModel?> GetBookItems(HttpClient client, Guid bookId)
        => await client.GetAsync<ItemModel?>($"/Items/myByBook?bookId={bookId}");

    public static async Task AddToMyShelf(HttpClient client, Guid bookId)
        => await client.PostAsync($"/Items/addToMyShelf?bookId={bookId}", null!);

    public static async Task RemoveFromMyShelf(HttpClient client, Guid bookId)
        => await client.DeleteAsync($"/Items/removeFromMyShelf?bookId={bookId}");

    public static async Task Enqueue(HttpClient client, Guid itemId)
        => await client.PostAsync($"/Queue/{itemId}/enqueue", null!);

    public static async Task LeaveQueue(HttpClient client, Guid itemId)
        => await client.PostAsync($"/Queue/{itemId}/leaveQueue", null!);

    public static async Task BecomeHolder(HttpClient client, Guid itemId)
        => await client.PostAsync($"/Queue/{itemId}/becomeHolder", null!);
}
