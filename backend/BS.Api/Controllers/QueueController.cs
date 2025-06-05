using BS.Core.Services.Items;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static BS.Api.Results.ErrorStatusCodeMapper;

namespace BS.Api.Controllers;

[Authorize]
[Route("[controller]")]
[ApiController]
public class QueueController : Controller
{
    private readonly IItemService _queueService;

    public QueueController(IItemService queueService)
    {
        _queueService = queueService;
    }

    [HttpPost("{itemId:guid}/enqueue")]
    public async Task<IActionResult> Enqueue(Guid itemId, [FromQuery] bool isForcedByOwner = false)
    {
        var enqueueResult = await _queueService.EnqueueAsync(itemId, isForcedByOwner);
        return MapResult(enqueueResult);
    }

    [HttpPost("{itemId:guid}/leaveQueue")]
    public async Task<IActionResult> LeaveQueue(Guid itemId)
    {
        var leaveResult = await _queueService.LeaveQueueAsync(itemId);
        return MapResult(leaveResult);
    }

    [HttpPost("{itemId:guid}/becomeHolder")]
    public async Task<IActionResult> MakeNextUserTheHolder(Guid itemId)
    {
        var queueResult = await _queueService.BecameHolderAsync(itemId);
        return MapResult(queueResult);
    }
}