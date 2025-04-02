namespace BS.Core.Models.User;

public record UserData
{
    public required Guid Id { get; set; }
    public required string Email { get; set; }
    public required string Username { get; set; }
    public required bool IsEmailConfirm { get; set; }
    public required bool IsProfileFilled { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? ContactUrl { get; set; }
    public string? PhotoUrl { get; set; }
}