using BS.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BS.Data.Configurations;

public class QueueItemEntityConfiguration : IEntityTypeConfiguration<QueueItemEntity>
{
    public void Configure(EntityTypeBuilder<QueueItemEntity> builder)
    {
        builder.ToTable(Tables.QueueItemsTableName);
        builder.HasKey(x => x.Id);

        builder.HasOne(queueItem => queueItem.User)
            .WithMany(user => user.QueueItems)
            .HasForeignKey(queueItem => queueItem.UserId);
        builder.HasOne(item => item.Item)
            .WithMany(item => item.QueueItems)
            .HasForeignKey(queueItem => queueItem.ItemId);

        builder.HasIndex(queueItem => new { queueItem.ItemId, queueItem.EnqueueTimeUtc })
            .IsUnique();
    }
}