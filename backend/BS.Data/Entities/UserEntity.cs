using BS.Data.Entities.Notifications.Base;
using Microsoft.AspNetCore.Identity;

namespace BS.Data.Entities;

public sealed class UserEntity : IdentityUser<Guid>
{
    public UserEntity()
    {
        Id = Guid.CreateVersion7();
    }

    public bool IsProfileFilled { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? ContactUrl { get; set; }
    public bool IsProfilePhotoUploaded { get; set; }
    public List<UserEntity> Friends { get; set; } = [];
    public List<UserEntity> ReceivedFriendRequests { get; set; } = [];
    public List<UserEntity> SentFriendRequests { get; set; } = [];
    public List<ItemEntity> Items { get; set; } = [];
    public List<QueueItemEntity> QueueItems { get; set; } = [];
    public List<NotificationBaseEntity> Notifications { get; set; } = [];
}