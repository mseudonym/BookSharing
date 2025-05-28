namespace BS.Core.Models.User;

public class QueueUserModel
{
    public required Guid Id { get; set; }
    public required string Username { get; set; }
    public string? LowQualityPhotoUrl { get; set; }
}