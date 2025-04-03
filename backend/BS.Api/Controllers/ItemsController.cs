using BS.Core.Models.Items;
using BS.Core.Models.Queue;
using BS.Core.Services.Items;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static BS.Api.Results.ErrorStatusCodeMapper;

namespace BS.Api.Controllers;

[Authorize]
[Route("[controller]")]
public class ItemsController : Controller
{
    private readonly IItemService _itemsService;

    public ItemsController(IItemService itemsService)
    {
        _itemsService = itemsService;
    }

    [HttpGet("my")]
    public async Task<ActionResult<MyItemInfo>> GetMyItemsWithHolder()
    {
        var result = await _itemsService.GetMyItemsWithHolderAsync();
        return result.IsFailed ? MapResult(result) : Ok(result.Value);
    }

    [HttpGet("friends")]
    public async Task<ActionResult<FriendItemInfo>> GetItemsIHold()
    {
        var result = await _itemsService.GetItemsCurrentUserHoldAsync();
        return result.IsFailed ? MapResult(result) : Ok(result.Value);
    }

    [HttpGet("byBookId")]
    public async Task<ActionResult<QueueModel[]>> GetAllQueuesOfBook(Guid bookId)
    {
        var result = await _itemsService.GetAllQueuesOfBook(bookId);
        return result.IsFailed ? MapResult(result) : Ok(result.Value);
    }

    [HttpPost("addToMyShelf")]
    public async Task<IActionResult> AddBookToMyShelf(Guid bookId)
    {
        var result = await _itemsService.AddToMyShelf(bookId);
        return result.IsFailed ? MapResult(result) : Ok();
    }
}