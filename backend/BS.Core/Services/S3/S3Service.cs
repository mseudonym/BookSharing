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

    public Task<Result> DeleteProfilePhotoAsync(Guid userId)
    {
        throw new NotImplementedException();
    }

    public string GetProfilePhotoUrl(Guid userId, PhotoQuality quality)
    {
        var keyById = $"{userId.ToString()}{JpgFormat.FileExtension}";
        var objectKey = GetPhotoPath(keyById, _options.ProfilePhotos, quality);

        return GeneratePreSignedUrl(objectKey);
    }

    public string GetBookCoverUrl(Guid bookId, PhotoQuality quality)
    {
        var fileName = $"{bookId.ToString()}{JpgFormat.FileExtension}";
        var objectKey = GetPhotoPath(fileName, _options.BookCovers, quality);

        return GeneratePreSignedUrl(objectKey);
    }

    public async Task<Result<string>> UploadProfilePhotoAsync(PhotoFileModel model) =>
        await UploadAsync(model, await _currentUserService.GetIdAsync(), _options.ProfilePhotos);

    public async Task<Result<string>> UploadBookCoverAsync(PhotoFileModel model, Guid bookId) =>
        await UploadAsync(model, bookId, _options.BookCovers);

    private async Task<Result<string>> UploadAsync(PhotoFileModel model, Guid entityId, string category)
    {
        if (model.ContentType != JpgFormat.ContentType)
        {
            return Result.Fail("File extension must be .jpg or .jpeg");
        }
        
        var fileName = $"{entityId}{JpgFormat.FileExtension}";
        var objectKey = GetPhotoPath(fileName, category, PhotoQuality.Original);

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

    private string GetPhotoPath(string fileName, string category, PhotoQuality quality)
    {
        var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

        env = env == "Development" ? "Staging" : env;

        return $"{env}/{quality:G}/{category}/{fileName}";
    }
}