using BS.Core.Models.Items;
using BS.Core.Services.Items;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static BS.Api.Results.ErrorStatusCodeMapper;

namespace BS.Api.Controllers;

[Authorize]
[Route("[controller]")]
[ApiController]
public class ItemsController : Controller
{
    private readonly IItemService _itemsService;

    public ItemsController(IItemService itemsService)
    {
        _itemsService = itemsService;
    }

    [HttpGet("my")]
    public async Task<ActionResult<ItemInfo[]>> GetMyItems()
    {
        var result = await _itemsService.GetMyItems();
        return MapResult(result);
    }

    [HttpGet("friends")]
    public async Task<ActionResult<ItemInfo[]>> GetFriendsItems()
    {
        var result = await _itemsService.GetFriendsItems();
        return MapResult(result);
    }

    [HttpGet("friendsByBook")]
    public async Task<ActionResult<ItemModel[]>> GetFriendsItemsByBook(Guid bookId)
    {
        var result = await _itemsService.GetFriendItemsByBook(bookId);
        return MapResult(result);
    }
    
    [HttpGet("myByBook")]
    public async Task<ActionResult<ItemModel?>> GetBookItems(Guid bookId)
    {
        var result = await _itemsService.GetMyItemByBook(bookId);
        return MapResult(result);
    }

    [HttpPost("addToMyShelf")]
    public async Task<IActionResult> AddBookToMyShelf(Guid bookId)
    {
        var result = await _itemsService.AddToMyShelf(bookId);
        return MapResult(result);
    }
    
    [HttpDelete("removeFromMyShelf")]
    public async Task<IActionResult> RemoveBookFromMyShelf(Guid bookId)
    {
        var result = await _itemsService.RemoveFromMyShelf(bookId);
        return MapResult(result);
    }
}