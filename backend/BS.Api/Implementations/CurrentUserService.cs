using BS.Core.Services.User;
using BS.Data.Entities;
using BS.Data.Entities;
using Microsoft.AspNetCore.Identity;

namespace BS.Api.Implementations;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<CurrentUserService> _logger;
    private readonly UserManager<UserEntity> _userManager;

    public CurrentUserService(
        IHttpContextAccessor httpContextAccessor,
        UserManager<UserEntity> userManager,
        ILogger<CurrentUserService> logger)
    {
        _httpContextAccessor = httpContextAccessor;
        _userManager = userManager;
        _logger = logger;
    }

    public async Task<Guid> GetIdAsync()
    {
        if (_httpContextAccessor.HttpContext is null)
        {
            _logger.LogError("HttpContext is null");
            throw new InvalidOperationException("HttpContext is null");
        }

        var currentUser = await _userManager.GetUserAsync(_httpContextAccessor.HttpContext.User);

        if (currentUser is null)
        {
            _logger.LogError("Cannot get user from HttpContext");
            throw new InvalidOperationException("Cannot get user from HttpContext");
        }

        return currentUser.Id;
    }
}