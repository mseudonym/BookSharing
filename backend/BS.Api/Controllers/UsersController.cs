using BS.Api.Requests;
using BS.Core.Models.S3;
using BS.Core.Models.User;
using BS.Core.Services.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static BS.Api.Results.ErrorStatusCodeMapper;

namespace BS.Api.Controllers;

[Authorize]
[Route("[controller]")]
public class UsersController : Controller
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("{username}")]
    public async Task<ActionResult<UserProfile>> GetUser([FromRoute] string username)
    {
        var getUserResult = await _userService.GetUserByUsername(username);

        if (getUserResult.IsFailed) return MapResult(getUserResult);

        return Ok(getUserResult.Value);
    }

    [HttpGet("search/{usernamePrefix}")]
    public async Task<ActionResult<UserProfile>> GetUsers([FromRoute] string usernamePrefix)
    {
        var users = await _userService.SearchByUsernamePrefix(usernamePrefix);

        if (users.IsFailed) return MapResult(users);

        return Ok(users.Value);
    }

    [HttpGet("me")]
    public async Task<ActionResult<UserData>> GetCurrentUser()
    {
        var getCurrentUserResult = await _userService.GetCurrentUser();

        if (getCurrentUserResult.IsFailed) return MapResult(getCurrentUserResult);

        return Ok(getCurrentUserResult.Value);
    }

    [HttpPost("editProfile")]
    public async Task<ActionResult<UserData>> EditProfile([FromForm] EditProfileRequest request)
    {
        var model = new EditProfileModel
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Username = request.Username,
            ContactUrl = request.ContactUrl,
            Photo = request.PhotoFile is null
                ? null
                : request.PhotoFile!.GetPhotoFileModel(),
        };
        var editUserProfile = await _userService.EditUserProfile(model);

        if (editUserProfile.IsFailed) return MapResult(editUserProfile);

        return Ok(editUserProfile.Value);
    }
}