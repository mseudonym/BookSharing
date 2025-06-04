using BS.Core.Models.Notifications.Base;
using BS.Core.Services.Notifications;
using Microsoft.AspNetCore.Mvc;
using static BS.Api.Results.ErrorStatusCodeMapper;

namespace BS.Api.Endpoints;

public static class NotificationEndpoints
{
    public static IEndpointConventionBuilder MapNotificationsEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var routeGroup = endpoints
            .MapGroup("Notifications")
            .WithTags("Notifications")
            .RequireAuthorization();


        routeGroup.MapGet("/", async Task<IResult> (
                [FromServices] INotificationsService notificationService,
                [FromQuery] int page = 0,
                [FromQuery] int pageSize = 20) =>
            {
                var result = await notificationService.GetNotificationsAsync(page, pageSize);
                return result.IsSuccess ? TypedResults.Ok(result.Value) : MapMinimalResult(result);
            })
            .Produces<NotificationBase[]>();

        routeGroup.MapPost("/markAsRead", async Task<IResult> (
            [FromServices] INotificationsService notificationService,
            [FromBody] Guid[] notificationIds) =>
        {
            var result = await notificationService.MarkAsReadAsync(notificationIds);
            return result.IsSuccess ? TypedResults.NoContent() : MapMinimalResult(result);
        });
        
        routeGroup.MapGet("/unreadCount", async Task<IResult> (
            [FromServices] INotificationsService notificationService) =>
        {
            var result = await notificationService.GetUnreadNotificationsCountAsync();
            return result.IsSuccess ? TypedResults.Ok(result.Value) : MapMinimalResult(result);
        })
        .Produces<int>();

        return routeGroup;
    }
}