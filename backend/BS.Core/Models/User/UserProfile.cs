using BS.Data.Entities.Notifications.Friendship;

namespace BS.Core.Models.User;

public class UserProfile
{
    public FriendshipStatus FriendshipStatus { get; set; }
    public Guid Id { get; set; }
    public required string Username { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public string? ContactUrl { get; set; }
    public string? HighQualityPhotoUrl { get; set; }
    public string? LowQualityPhotoUrl { get; set; }
}