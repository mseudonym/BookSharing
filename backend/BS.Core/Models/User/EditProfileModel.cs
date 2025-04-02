using BS.Core.Models.S3;

namespace BS.Core.Models.User;

public record EditProfileModel
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Username { get; set; }
    public string? ContactUrl { get; set; }
    public PhotoFileModel? Photo { get; set; }
}