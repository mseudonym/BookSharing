using BS.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using static BS.Data.Validations.DataBookValidationConstants;


namespace BS.Data.Configurations;

public class BookEntityConfiguration : IEntityTypeConfiguration<BookEntity>
{
    public void Configure(EntityTypeBuilder<BookEntity> builder)
    {
        builder.ToTable(Tables.BooksTableName);

        builder.HasKey(e => e.Id);

        builder.Property(user => user.Title).HasMaxLength(TitleMaxLength);
        builder.Property(user => user.Author).HasMaxLength(AuthorMaxLength);
        builder.Property(user => user.Isbn).HasMaxLength(IsbnMaxLength);
        builder.Property(user => user.Description).HasMaxLength(DescriptionMaxLength);
        builder.Property(user => user.Language).HasMaxLength(LanguageMaxLength);

        builder.HasMany(book => book.Items)
            .WithOne(item => item.Book)
            .HasForeignKey(item => item.BookId);
    }
}