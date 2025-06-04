using BS.Data.Configurations;
using BS.Data.Entities;
using BS.Data.Entities.Notifications.Base;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BS.Data.Context;

public class BookSharingContext(DbContextOptions<BookSharingContext> options)
    : IdentityDbContext<UserEntity, IdentityRole<Guid>, Guid>(options)
{
    public override DbSet<UserEntity> Users { get; set; }
    public DbSet<QueueItemEntity> QueueItems { get; set; }
    public DbSet<ItemEntity> Items { get; set; }
    public DbSet<BookEntity> Books { get; set; }
    public DbSet<NotificationBaseEntity> Notifications { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfiguration(new UserEntityConfiguration());
        builder.ApplyConfiguration(new QueueItemEntityConfiguration());
        builder.ApplyConfiguration(new ItemEntityConfiguration());
        builder.ApplyConfiguration(new BookEntityConfiguration());
        builder.ApplyConfiguration(new NotificationEntityConfiguration());

        base.OnModelCreating(builder);
    }
}