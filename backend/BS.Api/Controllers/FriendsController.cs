using BS.Core.Models.User;
using BS.Core.Services.Friends;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static BS.Api.Results.ErrorStatusCodeMapper;

namespace BS.Api.Controllers;

[Authorize]
[Route("[controller]")]
[ApiController]
public class FriendsController : Controller
{
    private readonly IFriendsService _friendsService;

    public FriendsController(IFriendsService friendsService)
    {
        _friendsService = friendsService;
    }

    [HttpGet("list")]
    public async Task<ActionResult<UserProfile[]>> GetFriends()
    {
        var friendsResult = await _friendsService.GetFriendsAsync();
        return MapResult(friendsResult);
    }

    [HttpPost("sendRequest")]
    public async Task<ActionResult<UserProfile>> SendFriendRequest([FromQuery] Guid personToSendId)
    {
        var sendRequestResult = await _friendsService.SendFriendRequestAsync(personToSendId);
        return MapResult(sendRequestResult);
    }
    
    [HttpPost("cancelRequest")]
    public async Task<ActionResult<UserProfile>> CancelFriendRequest([FromQuery] Guid person)
    {
        var sendRequestResult = await _friendsService.CancelFriendRequestAsync(person);
        return MapResult(sendRequestResult);
    }

    [HttpPost("respondRequest")]
    public async Task<ActionResult<UserProfile>> RespondToFriendRequest(
        [FromQuery] Guid personToRespondId,
        [FromQuery] bool isAccepted)
    {
        var respondRequestResult = await _friendsService.RespondToFriendRequestAsync(personToRespondId, isAccepted);
        return MapResult(respondRequestResult);
    }

    [HttpGet("requests/sent")]
    public async Task<ActionResult<UserProfile[]>> GetSentFriendRequests()
    {
        var sentRequestsResult = await _friendsService.GetSentFriendRequestsAsync();
        return MapResult(sentRequestsResult);
    }

    [HttpGet("requests/received")]
    public async Task<ActionResult<UserProfile[]>> GetReceivedFriendRequests()
    {
        var receivedFriendRequestsResult = await _friendsService.GetReceivedFriendRequestsAsync();
        return MapResult(receivedFriendRequestsResult);
    }

    [HttpDelete("delete")]
    public async Task<ActionResult<UserProfile>> DeleteFriendRequest([FromQuery] Guid personToDeleteId)
    {
        var deleteFriendResult = await _friendsService.DeleteFriendAsync(personToDeleteId);
        return MapResult(deleteFriendResult);
    }
}