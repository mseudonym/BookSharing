using BS.Core.Models.User;
using FluentResults;

namespace BS.Core.Services.User;

public interface IUserService
{
    public Task<Result<UserData>> GetCurrentUser();
    public Task<Result<UserProfile>> GetUserById(Guid personId);
    public Task<Result<UserProfile>> GetUserByUsername(string username);
    public Task<Result<UserProfile[]>> SearchByUsernamePrefix(string usernamePrefix);
    public Task<Result<UserData>> EditUserProfile(EditProfileModel model);
    public Task<Result<string>> EditUsername(string newUsername);
}