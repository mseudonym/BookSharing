using Microsoft.AspNetCore.Http;

namespace BS.Core.Models.S3;

public static class FormFileExtensions
{
    public static PhotoFileModel GetPhotoFileModel(this IFormFile formFile) =>
        new()
        {
            Stream = formFile.OpenReadStream(),
            ContentType = formFile.ContentType,
            FileExtension = Path.GetExtension(formFile.FileName),
            FileLength = formFile.Length,
        };
}