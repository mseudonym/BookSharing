namespace BS.Core.Options;

public class YandexCloudCredentialsOptions
{
    public const string Section = nameof(YandexCloudCredentialsOptions);
    
    public required string AccessKey { get; set; }
    public required string SecretKey { get; set; }
}