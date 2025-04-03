using System.Net;
using Amazon.S3;
using Amazon.S3.Model;
using BS.Core.Models.S3;
using BS.Core.Options;
using BS.Core.Services.User;
using FluentResults;
using Microsoft.Extensions.Options;

namespace BS.Core.Services.S3;

public class S3Service : IS3Service
{
    private readonly ICurrentUserService _currentUserService;
    private readonly YandexCloudS3Options _options;
    private readonly IAmazonS3 _s3Client;

    public S3Service(
        ICurrentUserService currentUserService,
        IAmazonS3 s3Client,
        IOptions<YandexCloudS3Options> ycS3Options)
    {
        _currentUserService = currentUserService;
        _s3Client = s3Client;
        _options = ycS3Options.Value;
    }

    public async Task<Result<string>> UploadProfilePhotoAsync(PhotoFileModel model)
    {
        var currentUserId = await _currentUserService.GetIdAsync();

        var objectKey =
            $"{_options.OriginalQualityProfilePhotoPath}/{currentUserId.ToString()}{model.FileExtension.ToLower()}";

        var putObjectRequest = new PutObjectRequest
        {
            BucketName = _options.PhotosBucketName,
            Key = objectKey,
            InputStream = model.Stream,
            ContentType = model.ContentType,
        };
        var response = await _s3Client.PutObjectAsync(putObjectRequest);
        if (response.HttpStatusCode == HttpStatusCode.OK) return Result.Ok(GeneratePreSignedUrl(objectKey));

        return Result.Fail("Failed to upload profile photo");
    }

    public Task<Result> DeleteProfilePhotoAsync(Guid userId)
    {
        throw new NotImplementedException();
    }

    public string GetHighQualityProfilePhotoUrlAsync(Guid userId)
    {
        var objectKey = $"{_options.HighQualityProfilePhotoPath}/{userId.ToString()}{PngFormat.FileExtension}";

        return GeneratePreSignedUrl(objectKey);
    }

    public string GetLowQualityProfilePhotoUrlAsync(Guid userId)
    {
        var objectKey = $"{_options.LowQualityProfilePhotoPath}/{userId.ToString()}{PngFormat.FileExtension}";

        return GeneratePreSignedUrl(objectKey);
    }

    public async Task<Result<string>> UploadBookCoverAsync(PhotoFileModel model, Guid bookId)
    {
        var objectKey = $"{_options.BookCoverPath}/{bookId.ToString()}{model.FileExtension}";

        var putObjectRequest = new PutObjectRequest
        {
            BucketName = _options.PhotosBucketName,
            Key = objectKey,
            InputStream = model.Stream,
            ContentType = model.ContentType,
        };
        var response = await _s3Client.PutObjectAsync(putObjectRequest);
        if (response.HttpStatusCode == HttpStatusCode.OK) return Result.Ok(GeneratePreSignedUrl(objectKey));

        return Result.Fail("Failed to upload book cover");
    }

    public Task<Result> DeleteBookCoverAsync(Guid bookId)
    {
        throw new NotImplementedException();
    }

    public string GetBookCoverUrl(Guid bookId)
    {
        var objectKey = $"{_options.BookCoverPath}/{bookId.ToString()}{PngFormat.FileExtension}";

        return GeneratePreSignedUrl(objectKey);
    }

    private string GeneratePreSignedUrl(string objectKey)
    {
        var request = new GetPreSignedUrlRequest
        {
            BucketName = _options.PhotosBucketName,
            Key = objectKey,
            Verb = HttpVerb.GET,
            Expires = DateTime.UtcNow.AddHours(_options.ExpireDurationInHours),
        };

        return _s3Client.GetPreSignedURL(request);
    }
}