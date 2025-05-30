namespace BS.Core.Options;

public class FrontendOptions
{
    public const string Section = nameof(FrontendOptions);

    public required string Url { get; set; }
    public required string EmailConfirmPath { get; set; }
    public required string PasswordResetPath { get; set; }
}