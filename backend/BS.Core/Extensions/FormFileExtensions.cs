using BS.Core.Models.S3;
using Microsoft.AspNetCore.Http;

namespace BS.Core.Extensions;

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