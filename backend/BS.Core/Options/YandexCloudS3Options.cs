namespace BS.Core.Options;

public class YandexCloudS3Options
{
    public const string Section = nameof(YandexCloudS3Options);

    public required string Url { get; set; }
    public required string PhotosBucketName { get; set; }
    public required int ExpireDurationInHours { get; set; }
    
    public required string ProfilePhoto { get; set; }
    public required string BookCover { get; set; }
}