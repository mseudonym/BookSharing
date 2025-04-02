using BS.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BS.Data.Configurations;

public class ItemEntityConfiguration : IEntityTypeConfiguration<ItemEntity>
{
    public void Configure(EntityTypeBuilder<ItemEntity> builder)
    {
        builder.ToTable(Tables.ItemsTableName);

        builder.HasKey(item => item.Id);
        builder.HasOne(item => item.Book)
            .WithMany(item => item.Items)
            .HasForeignKey(item => item.BookId);
        
        builder.HasMany(item => item.QueueItems)
            .WithOne(item => item.Item)
            .HasForeignKey(queueItem => queueItem.ItemId);
    }
}