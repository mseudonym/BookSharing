using BS.Core.Models.User;
using BS.Core.Services.S3;
using BS.Data.Entities;

namespace BS.Core.Models.Mapping;

public class UserMapper
{
    private readonly IS3Service _s3Service;

    public UserMapper(IS3Service s3Service)
    {
        _s3Service = s3Service;
    }

    public UserData ToUserData(UserEntity userEntity) =>
        new()
        {
            Id = userEntity.Id,
            Email = userEntity.Email ?? "",
            Username = userEntity.UserName ?? "",

            IsEmailConfirm = userEntity.EmailConfirmed,
            IsProfileFilled = userEntity.IsProfileFilled,
            FirstName = userEntity.FirstName,
            LastName = userEntity.LastName,
            ContactUrl = userEntity.ContactUrl,
            PhotoUrl = userEntity.IsProfilePhotoUploaded
                ? _s3Service.GetHighQualityProfilePhotoUrlAsync(userEntity.Id)
                : "",
        };

    public UserProfile[] ToUserProfile(IEnumerable<UserEntity> persons, FriendshipStatus friendshipStatus)
        => persons.Select(person => ToUserProfile(person, friendshipStatus)).ToArray();

    public UserProfile ToUserProfile(UserEntity person, FriendshipStatus friendshipStatus)
    {
        return new UserProfile
        {
            FriendshipStatus = friendshipStatus,
            Id = person.Id,
            Username = person.UserName ?? "",
            FirstName = person.FirstName ?? "",
            LastName = person.LastName ?? "",
            ContactUrl = friendshipStatus == FriendshipStatus.Friend ? person.ContactUrl : null,
            HighQualityPhotoUrl = person.IsProfilePhotoUploaded
                ? _s3Service.GetHighQualityProfilePhotoUrlAsync(person.Id)
                : "",
            LowQualityPhotoUrl = person.IsProfilePhotoUploaded
                ? _s3Service.GetLowQualityProfilePhotoUrlAsync(person.Id)
                : "",
        };
    }

    public QueueUser? ToQueueUser(UserEntity? userEntity)
    {
        if (userEntity == null)
            return null;
        return new QueueUser
        {
            Id = userEntity.Id,
            Username = userEntity.UserName ?? "",
            LowQualityPhotoUrl = userEntity.IsProfilePhotoUploaded
                ? _s3Service.GetLowQualityProfilePhotoUrlAsync(userEntity.Id)
                : null,
        };
    }
}