using BS.Core.Models.Notifications.Base;
using FluentResults;

namespace BS.Core.Services.Notifications;

public interface INotificationsService
{
    Task<Result<NotificationBase[]>> GetNotificationsAsync(int page, int pageSize);
    Task<Result<int>> GetUnreadNotificationsCountAsync();
    Task<Result> MarkAsReadAsync(Guid[] notificationIds);
}


