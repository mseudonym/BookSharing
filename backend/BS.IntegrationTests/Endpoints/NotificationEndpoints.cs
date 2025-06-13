using BS.Core.Models.Notifications.Base;
using BS.IntegrationTests.Extensions;

namespace BS.IntegrationTests.Endpoints;

public static class NotificationEndpoints
{
    public static async Task<NotificationBase[]> GetNotifications(HttpClient client, int page = 0, int pageSize = 20)
        => await client.GetAsync<NotificationBase[]>($"/Notifications?page={page}&pageSize={pageSize}");

    public static async Task MarkAsRead(HttpClient client, Guid[] notificationIds)
        => await client.PostAsync("/Notifications/markAsRead", System.Net.Http.Json.JsonContent.Create(notificationIds));

    public static async Task<int> GetUnreadCount(HttpClient client)
        => await client.GetAsync<int>("/Notifications/unreadCount");
}
