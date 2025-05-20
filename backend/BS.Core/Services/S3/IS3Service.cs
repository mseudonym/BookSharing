using BS.Core.Models.S3;
using FluentResults;

namespace BS.Core.Services.S3;

public interface IS3Service
{
    /// <summary>
    ///     Загружает в S3 хранилище фото в исходном разрешении
    /// </summary>
    /// <param name="photo">Модель файла, который будет загружен как фото профиля</param>
    public Task<Result<string>> UploadProfilePhotoAsync(PhotoFileModel photo);

    /// <summary>
    ///     Удаляет фото профиля указанного юзера
    /// </summary>
    /// <param name="userId">Id пользователя, фото профиля которого будут удалены</param>
    public Task<Result> DeleteProfilePhotoAsync(Guid userId);

    /// <summary>
    ///     Метод не знает о существования объекта в S3 storage, а просто возвращает pre signed URL на фото профиля
    /// </summary>
    /// <param name="userId">Id человека на фото профиля которого нужна ссылка</param>
    /// <param name="quality">Разрешение изображения</param>
    public string GetProfilePhotoUrl(Guid userId, PhotoQuality quality);
    
    /// <summary>
    ///     Метод не знает о существования объекта в S3 storage, а просто возвращает pre signed URL на обложку книги
    /// </summary>
    /// <param name="bookId">Id книги на обложку которой нужна ссылка</param>
    /// <param name="quality">Разрешение изображения</param>
    public string GetBookCoverUrl(Guid bookId, PhotoQuality quality);
    public Task<Result<string>> UploadBookCoverAsync(PhotoFileModel file, Guid bookId);
    public Task<Result> DeleteBookCoverAsync(Guid bookId);
}