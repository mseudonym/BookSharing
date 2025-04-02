using BS.Core.Models.Queue;
using BS.Core.Services.Queue;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static BS.Api.Results.ErrorStatusCodeMapper;

namespace BS.Api.Controllers;

[Authorize]
[Route("[controller]")]
public class QueueController: Controller
{
    private IQueueService _queueService;

    public QueueController(IQueueService queueService)
    {
        _queueService = queueService;
    }

    [HttpGet("{itemId:guid}/getQueue")]
    public async Task<ActionResult<QueueModel>> GetQueue(Guid itemId)
    {
        var queueResult = await _queueService.GetQueueAsync(itemId);
        return Ok(queueResult.Value);
    }

    [HttpPost("{itemId:guid}/enqueue")]
    public async Task<IActionResult> Enqueue(Guid itemId, [FromQuery] bool isForcedByOwner = false)
    {
        var enqueueResult = await _queueService.EnqueueAsync(itemId, isForcedByOwner);
        return enqueueResult.IsFailed ? MapResult(enqueueResult) : Ok(enqueueResult.Value);
    }

    [HttpPost("{itemId:guid}/leaveQueue")]
    public async Task<IActionResult> LeaveQueue(Guid itemId)
    {
        var leaveResult = await _queueService.LeaveQueueAsync(itemId);
        return leaveResult.IsFailed ? MapResult(leaveResult) : Ok();
    }

    [HttpPost("{itemId:guid}/becomeHolder")]
    public async Task<IActionResult> MakeNextUserTheHolder(Guid itemId)
    {
        var queueResult = await _queueService.MakeNextUserTheHolderAsync(itemId);
        return queueResult.IsFailed ? MapResult(queueResult) : Ok();
    }
}