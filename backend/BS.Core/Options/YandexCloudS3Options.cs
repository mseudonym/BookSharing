namespace BS.Core.Options;

public class YandexCloudS3Options
{
    public const string Section = nameof(YandexCloudS3Options);

    public required string Url { get; set; }
    public required string PhotosBucketName { get; set; }
    public required int ExpireDurationInHours { get; set; }

    public required string OriginalQualityProfilePhotoPath { get; set; }
    public required string HighQualityProfilePhotoPath { get; set; }
    public required string LowQualityProfilePhotoPath { get; set; }
    public required string BookCoverPath { get; set; }
}