using BS.Core.Errors.Validation;
using BS.Core.Models.Mapping;
using BS.Core.Models.Notifications.Base;
using BS.Core.Options;
using BS.Core.Services.User;
using BS.Data.Context;
using FluentResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace BS.Core.Services.Notifications;

public class NotificationService : INotificationsService
{
    private readonly ICurrentUserService _currentUserService;
    private readonly BookSharingContext _dbContext;
    private readonly PaginationOptions _paginationOptions;
    private readonly NotificationMapper _notificationMapper;

    public NotificationService(
        ICurrentUserService currentUserService,
        BookSharingContext dbContext,
        IOptions<PaginationOptions> paginationOptions,
        NotificationMapper notificationMapper)
    {
        _currentUserService = currentUserService;
        _dbContext = dbContext;
        _paginationOptions = paginationOptions.Value;
        _notificationMapper = notificationMapper;
    }

    public async Task<Result<NotificationBase[]>> GetNotificationsAsync(int page, int pageSize)
    {
        if (pageSize <= 0 || pageSize > _paginationOptions.MaxPageSize)
        {
            return Result.Fail(new ValidationError("InvalidPageSize", 
                $"Page size must be between 1 and {_paginationOptions.MaxPageSize}."));
        }
        
        var currentUserId = await _currentUserService.GetIdAsync();

        var notifications = await _dbContext
            .Notifications
            .Where(n => !n.IsDeleted)
            .Where(n => n.RecipientId == currentUserId)
            .OrderByDescending(n => n.CreatedAt)
            .Skip(page * pageSize)
            .Take(pageSize)
            .Include("Item.Book")
            .Include("NewQueueMember")
            .Include("NewHolder")
            .ToArrayAsync();
        
        var models = _notificationMapper.ToModel(notifications);
        return Result.Ok(models);
    }

    public async Task<Result<int>> GetUnreadNotificationsCountAsync()
    {
        var currentUserId = await _currentUserService.GetIdAsync();
        
        var unreadNotificationsCount = await _dbContext
            .Notifications
            .Where(n => n.RecipientId == currentUserId && !n.IsRead && !n.IsDeleted)
            .CountAsync();
        
        return unreadNotificationsCount;
    }

    public async Task<Result> MarkAsReadAsync(Guid[] notificationIds)
    {
        var currentUserId = await _currentUserService.GetIdAsync();
        
        var notifications = await _dbContext
            .Notifications
            .Where(n => n.RecipientId == currentUserId && notificationIds.Contains(n.Id))
            .ToArrayAsync();

        foreach (var notification in notifications)
        {
            notification.IsRead = true;
        }
        await _dbContext.SaveChangesAsync();
        
        
        throw new NotImplementedException();
    }
}