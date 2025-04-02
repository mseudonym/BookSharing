using BS.Data.Configurations;
using BS.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BS.Data.Context;

public class BookSharingContext(DbContextOptions<BookSharingContext> options) : IdentityDbContext<UserEntity, IdentityRole<Guid>, Guid>(options)
{
    public override DbSet<UserEntity> Users { get; set; }
    public DbSet<QueueItemEntity> QueueItems { get; set; }
    public DbSet<ItemEntity> Items { get; set; }
    public DbSet<BookEntity> Books { get; set; }
    
    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfiguration(new UserEntityConfiguration());
        builder.ApplyConfiguration(new QueueItemEntityConfiguration());
        builder.ApplyConfiguration(new ItemEntityConfiguration());
        builder.ApplyConfiguration(new BookEntityConfiguration());
        
        base.OnModelCreating(builder);
    }
}
