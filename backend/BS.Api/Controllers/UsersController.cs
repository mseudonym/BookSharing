using System.Net.Mime;
using BS.Api.Requests;
using BS.Core.Extensions;
using BS.Core.Models.User;
using BS.Core.Services.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static BS.Api.Results.ErrorStatusCodeMapper;

namespace BS.Api.Controllers;

[Authorize]
[Route("[controller]")]
[ApiController]
public class UsersController : Controller
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("{username}")]
    [ProducesResponseType(typeof(UserProfile), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserProfile>> GetUser([FromRoute] string username)
    {
        var getUserResult = await _userService.GetUserByUsername(username);
        return MapResult(getUserResult);
    }

    [HttpGet("search/{usernamePrefix}")]
    public async Task<ActionResult<UserProfile[]>> GetUsers([FromRoute] string usernamePrefix)
    {
        var users = await _userService.SearchByUsernamePrefix(usernamePrefix);
        return MapResult(users);
    }

    [HttpGet("me")]
    public async Task<ActionResult<UserData>> GetCurrentUser()
    {
        var getCurrentUserResult = await _userService.GetCurrentUser();
        return MapResult(getCurrentUserResult);
    }

    [HttpPost("editProfile")]
    [Consumes(MediaTypeNames.Multipart.FormData)]
    [ProducesResponseType(typeof(UserData), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
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
        return MapResult(editUserProfile);
    }
}