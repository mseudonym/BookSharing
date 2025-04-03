namespace BS.Core.Options;

public class EmailOptions
{
    public const string Section = nameof(EmailOptions);

    public required string Host { get; set; }
    public int Port { get; set; }
    public required string DisplayName { get; set; }
    public required string NoreplyEmail { get; set; }
    public required string Username { get; set; }
    public required string Password { get; set; }
}