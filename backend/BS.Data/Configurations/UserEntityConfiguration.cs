using BS.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using static BS.Data.Validations.DataUserValidationConstants;


namespace BS.Data.Configurations;

public class UserEntityConfiguration : IEntityTypeConfiguration<UserEntity>
{
    public void Configure(EntityTypeBuilder<UserEntity> builder)
    {
        builder.HasKey(e => e.Id);

        builder.Property(user => user.UserName).HasMaxLength(UsernameMaxLength);
            
        builder.Property(user => user.IsProfileFilled).HasDefaultValue(false);
        builder.Property(user => user.IsProfilePhotoUploaded).HasDefaultValue(false);
        builder.Property(user => user.FirstName).HasMaxLength(FirstNameMaxLength);
        builder.Property(user => user.LastName).HasMaxLength(LastNameMaxLength);
        builder.Property(user => user.ContactUrl).HasMaxLength(ContactUrlMaxLength);

        
        builder
            .HasMany(user => user.Friends)
            .WithMany()
            .UsingEntity(join => join.ToTable(Tables.UserFriendsTableName));

        builder
            .HasMany(user => user.ReceivedFriendRequests)
            .WithMany(p => p.SentFriendRequests)
            .UsingEntity(join => join.ToTable(Tables.UserFriendsTableName));
        
        builder
            .HasMany(user => user.SentFriendRequests)
            .WithMany(p => p.ReceivedFriendRequests)
            .UsingEntity(join => join.ToTable(Tables.FriendRequestsTableName));
        
        builder
            .HasMany(user => user.QueueItems)
            .WithOne(queueItem => queueItem.User)
            .HasForeignKey(queueItem => queueItem.UserId);
        
        builder.HasMany(user => user.Items)
            .WithOne(item => item.Owner)
            .HasForeignKey(item => item.OwnerId);
    }
}