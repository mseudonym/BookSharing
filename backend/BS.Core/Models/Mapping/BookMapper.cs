using BS.Core.Models.Book;
using BS.Core.Models.S3;
using BS.Core.Services.S3;
using BS.Data.Entities;

namespace BS.Core.Models.Mapping;

public class BookMapper
{
    private readonly IS3Service _s3Service;

    public BookMapper(IS3Service s3Service)
    {
        _s3Service = s3Service;
    }

    public BookModel ToBookModel(BookEntity bookEntity, PhotoQuality quality = PhotoQuality.High) =>
        new()
        {
            Id = bookEntity.Id,
            Title = bookEntity.Title,
            Author = bookEntity.Author,
            Description = bookEntity.Description,
            BookCoverUrl = bookEntity.IsPhotoUploaded ? _s3Service.GetBookCoverUrl(bookEntity.Id, quality) : "",
            Language = bookEntity.Language,
            PublicationYear = bookEntity.PublicationYear,
            IsAddedByUser = bookEntity.IsAddedByUser,
            IsPhotoUploaded = bookEntity.IsPhotoUploaded,
            Isbn = bookEntity.Isbn,
        };
}