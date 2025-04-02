namespace BS.Core.Models.S3;

public class PhotoFileModel
{
    public required Stream Stream { get; set; }
    public required string ContentType { get; set; }
    public required string FileExtension { get; set; }
    public long FileLength { get; set; }
}