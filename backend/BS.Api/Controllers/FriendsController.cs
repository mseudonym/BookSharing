using BS.Core.Models.User;
using BS.Core.Services.Friends;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static BS.Api.Results.ErrorStatusCodeMapper;

namespace BS.Api.Controllers;

[Authorize]
[Route("[controller]")]
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

        if (friendsResult.IsFailed) return MapResult(friendsResult);

        return Ok(friendsResult.Value);
    }

    [HttpPost("sendRequest")]
    public async Task<ActionResult<UserProfile>> SendFriendRequest([FromQuery] Guid personToSendId)
    {
        var sendRequestResult = await _friendsService.SendFriendRequestAsync(personToSendId);

        if (sendRequestResult.IsFailed) return MapResult(sendRequestResult);

        return Ok();
    }

    [HttpPost("respondRequest")]
    public async Task<ActionResult<UserProfile>> RespondToFriendRequest(
        [FromQuery] Guid personToRespondId,
        [FromQuery] bool isAccepted)
    {
        var respondRequestResult = await _friendsService.RespondToFriendRequestAsync(personToRespondId, isAccepted);

        if (respondRequestResult.IsFailed) return MapResult(respondRequestResult);

        return Ok();
    }

    [HttpGet("requests/sent")]
    public async Task<ActionResult<UserProfile[]>> GetSentFriendRequests()
    {
        var sentRequestsResult = await _friendsService.GetSentFriendRequestsAsync();

        if (sentRequestsResult.IsFailed) return MapResult(sentRequestsResult);

        return Ok(sentRequestsResult.Value);
    }

    [HttpGet("requests/received")]
    public async Task<ActionResult<UserProfile[]>> GetReceivedFriendRequests()
    {
        var receivedFriendRequestsResult = await _friendsService.GetReceivedFriendRequestsAsync();

        if (receivedFriendRequestsResult.IsFailed) return MapResult(receivedFriendRequestsResult);

        return Ok(receivedFriendRequestsResult.Value);
    }

    [HttpDelete("delete")]
    public async Task<ActionResult<UserProfile>> DeleteFriendRequest([FromQuery] Guid personToDeleteId)
    {
        var deleteFriendResult = await _friendsService.DeleteFriendAsync(personToDeleteId);

        if (deleteFriendResult.IsFailed) return MapResult(deleteFriendResult);

        return Ok();
    }
}