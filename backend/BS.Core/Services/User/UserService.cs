using BS.Core.Errors;
using BS.Core.Extensions;
using BS.Core.Models.Mapping;
using BS.Core.Models.User;
using BS.Core.Services.S3;
using BS.Core.Validations;
using BS.Data.Context;
using BS.Data.Entities;
using FluentResults;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ValidationResult = FluentValidation.Results.ValidationResult;

namespace BS.Core.Services.User;

internal class UserService : IUserService
{
    private readonly IValidator<string> _changeUsernameValidator = new UsernameValidator();
    private readonly ICurrentUserService _currentUserService;
    private readonly BookSharingContext _dbContext;

    private readonly IValidator<EditProfileModel> _editProfileModelValidator = new ProfileModelValidator();
    private readonly IS3Service _s3Service;
    private readonly UserManager<UserEntity> _userManager;
    private readonly UserMapper _userMapper;

    public UserService(
        BookSharingContext dbContext,
        UserManager<UserEntity> userManager,
        IS3Service s3Service,
        ICurrentUserService currentUserService,
        UserMapper userMapper)
    {
        _dbContext = dbContext;
        _userManager = userManager;
        _s3Service = s3Service;
        _currentUserService = currentUserService;
        _userMapper = userMapper;
    }

    public async Task<Result<UserData>> EditUserProfile(EditProfileModel model)
    {
        var errors = new List<IError>();

        var currentUserId = await _currentUserService.GetIdAsync();
        var currentUser = await _dbContext.Users.Where(u => u.Id == currentUserId).FirstAsync();

        var validationResult = await ValidateEditUserModel(model, currentUser.IsProfileFilled);
        if (!validationResult.IsValid)
            return Result.Fail<UserData>(new ModelValidationError(validationResult.ErrorsToString()));

        if (model.Photo is not null)
        {
            var uploadResult = await _s3Service.UploadProfilePhotoAsync(model.Photo);
            if (uploadResult.IsFailed)
                errors.AddRange(uploadResult.Errors);
            else
                currentUser.IsProfilePhotoUploaded = true;
        }

        if (model.Username != null)
        {
            var editUsernameResult = await EditUsername(model.Username);
            if (editUsernameResult.IsFailed)
            {
                errors.AddRange(editUsernameResult.Errors);
            }
        }

        currentUser.FirstName = string.IsNullOrEmpty(model.FirstName) ? currentUser.FirstName : model.FirstName;
        currentUser.LastName = string.IsNullOrEmpty(model.LastName) ? currentUser.LastName : model.LastName;
        currentUser.ContactUrl = string.IsNullOrEmpty(model.ContactUrl) ? currentUser.ContactUrl : model.ContactUrl;
        currentUser.IsProfileFilled = true;

        await _dbContext.SaveChangesAsync();

        currentUser = await _dbContext.Users.Where(u => u.Id == currentUserId).FirstAsync();

        return errors.Any()
            ? Result.Fail<UserData>(errors)
            : Result.Ok(_userMapper.ToUserData(currentUser));
    }

    public async Task<Result<UserProfile[]>> SearchByUsernamePrefix(string usernamePrefix)
    {
        if (usernamePrefix.Length < 3) return Result.Fail<UserProfile[]>(new UsernameSearchPrefixTooShortError());

        var currentUserId = await _currentUserService.GetIdAsync();
        var currentUser = await _dbContext.Users
            .Where(u => u.Id == currentUserId)
            .Include(user => user.Friends)
            .Include(user => user.ReceivedFriendRequests)
            .Include(user => user.SentFriendRequests)
            .FirstAsync();

        var normalizedUsernamePrefix = usernamePrefix.ToUpper();
        var usersProfiles = await _dbContext.Users
            .Where(u => u.IsProfileFilled)
            .Where(u => u.NormalizedUserName!.StartsWith(normalizedUsernamePrefix))
            .Take(3)
            .Select(person => _userMapper.ToUserProfile(person, GetFriendshipStatus(currentUser, person)))
            .ToArrayAsync();

        return Result.Ok(usersProfiles);
    }

    public async Task<Result<string>> EditUsername(string newUsername)
    {
        var validationResult = await _changeUsernameValidator.ValidateAsync(newUsername);
        if (!validationResult.IsValid)
            return Result.Fail<string>(new ModelValidationError(validationResult.ErrorsToString()));

        var currentUserId = await _currentUserService.GetIdAsync();
        var currentUser = await _dbContext.Users.Where(u => u.Id == currentUserId).FirstAsync();
        
        var existingUser = await _userManager.FindByNameAsync(newUsername);
        if (existingUser != null && existingUser.Id != currentUser.Id)
            return Result.Fail(new UsernameAlreadyTakenError(newUsername));

        // Обновляем username
        var setUserNameResult = await _userManager.SetUserNameAsync(currentUser, newUsername);
        if (!setUserNameResult.Succeeded)
        {
            return Result.Fail("Failed to set username");;
        }

        // Сохраняем изменения (обычно SetUserNameAsync это уже делает, но если нет)
        var updateResult = await _userManager.UpdateAsync(currentUser);
        if (!updateResult.Succeeded)
        {
            return Result.Fail("Failed to update username");
        }

        return Result.Ok();
    }

    public async Task<Result<UserData>> GetCurrentUser()
    {
        var currentUserId = await _currentUserService.GetIdAsync();
        var currentUser = await _dbContext.Users.Where(u => u.Id == currentUserId).FirstAsync();

        return Result.Ok(_userMapper.ToUserData(currentUser));
    }

    public async Task<Result<UserProfile>> GetUserById(Guid personId)
    {
        var currentUserId = await _currentUserService.GetIdAsync();
        var currentUser = await _dbContext.Users
            .Where(u => u.Id == currentUserId)
            .Include(user => user.Friends)
            .Include(user => user.ReceivedFriendRequests)
            .Include(user => user.SentFriendRequests)
            .FirstAsync();

        var person = await _dbContext.Users.Where(u => u.Id == personId).FirstOrDefaultAsync();

        if (person is null) return Result.Fail<UserProfile>(new PersonNotFoundError(personId));

        var friendshipStatus = GetFriendshipStatus(currentUser, person);
        return Result.Ok(_userMapper.ToUserProfile(person, friendshipStatus));
    }

    public async Task<Result<UserProfile>> GetUserByUsername(string username)
    {
        var currentUserId = await _currentUserService.GetIdAsync();
        var currentUser = await _dbContext.Users
            .Where(u => u.Id == currentUserId)
            .Include(user => user.Friends)
            .Include(user => user.ReceivedFriendRequests)
            .Include(user => user.SentFriendRequests)
            .FirstAsync();

        var person = await _dbContext.Users
            .Where(u => u.UserName == username)
            .FirstOrDefaultAsync();

        if (person is null || !person.IsProfileFilled)
            return Result.Fail<UserProfile>(new PersonNotFoundError(username));

        var friendshipStatus = GetFriendshipStatus(currentUser, person);
        return Result.Ok(_userMapper.ToUserProfile(person, friendshipStatus));
    }

    private async Task<ValidationResult> ValidateEditUserModel(
        EditProfileModel model,
        bool isProfileFilled)
    {
        ValidationResult validationResult;
        if (isProfileFilled)
            validationResult = await _editProfileModelValidator.ValidateNotNullFieldsAsync(model);
        else
            validationResult = await _editProfileModelValidator.ValidateAsync(model);

        return validationResult;
    }

    /// <summary>
    ///     Возвращает FriendshipStatus для текущего юзера и другого юзера.
    ///     ВАЖНО! Чтобы метод корректно отработал необходимо, чтобы в currentUser были подгружены поля
    ///     Friends, SentFriendRequests, ReceivedFriendRequests.
    /// </summary>
    /// <param name="currentUser">Текущий пользователь</param>
    /// <param name="person">Юзер, про которого мы хоти узнать FriendshipStatus</param>
    private static FriendshipStatus GetFriendshipStatus(UserEntity currentUser, UserEntity person)
    {
        if (currentUser.Friends.Any(user => user.Id == person.Id)) return FriendshipStatus.Friend;
        if (currentUser.ReceivedFriendRequests.Any(user => user.Id == person.Id)) return FriendshipStatus.IncomeRequest;
        if (currentUser.SentFriendRequests.Any(friend => friend.Id == person.Id))
            return FriendshipStatus.OutcomeRequest;

        return FriendshipStatus.None;
    }
}