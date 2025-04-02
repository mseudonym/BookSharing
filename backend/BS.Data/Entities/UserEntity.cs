using Microsoft.AspNetCore.Identity;

namespace BS.Data.Entities;

public class UserEntity : IdentityUser<Guid>
{
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
}