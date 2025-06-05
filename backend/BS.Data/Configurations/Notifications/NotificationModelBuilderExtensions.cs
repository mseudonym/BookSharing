using BS.Data.Entities.Notifications.FriendUpdate;
using BS.Data.Entities.Notifications.Friendship;
using BS.Data.Entities.Notifications.Items;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace BS.Data.Configurations.Notifications;

public static class NotificationModelBuilderExtensions
{
    public static void ConfigureNotificationEntities(this ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<FriendUpdatesNotificationBaseEntity>(builder =>
        {
            builder.HasOne(x => x.Friend)
                .WithMany()
                .HasForeignKey(x => x.FriendId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<ItemNotificationBaseEntity>(builder =>
        {
            builder.HasOne(x => x.Item)
                .WithMany()
                .HasForeignKey(x => x.ItemId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<SomeoneQueueToItemNotificationEntity>(builder =>
        {
            builder.Property(x => x.NewQueueMemberId)
                .HasColumnName("PersonId");
            builder.HasOne(x => x.NewQueueMember)
                .WithMany()
                .HasForeignKey(x => x.NewQueueMemberId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // 5. Для SomeoneBecameHolderOfYourItemNotificationEntity — связь с NewHolder
        modelBuilder.Entity<SomeoneBecameHolderOfYourItemNotificationEntity>(builder =>
        {
            builder.Property(x => x.NewHolderId)
                .HasColumnName("PersonId");

            builder.HasOne(x => x.NewHolder)
                .WithMany()
                .HasForeignKey(x => x.NewHolderId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<FriendTakeBookToReadNotificationEntity>(builder =>
        {
            builder.Property(x => x.FriendId)
                .HasColumnName("PersonId");

            builder.HasOne(x => x.Book)
                .WithMany()
                .HasForeignKey(x => x.BookId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<FriendshipStatusChangedNotificationEntity>(builder =>
        {
            builder.Property(x => x.PersonId)
                .HasColumnName("PersonId");
            
            builder.HasOne(x => x.Person)
                .WithMany()
                .HasForeignKey(x => x.PersonId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // 8. Для NewBooksInFriendShelfNotificationEntity — сериализация NewBookIds
        modelBuilder.Entity<NewBooksInFriendShelfNotificationEntity>(builder =>
        {
            builder.Property(x => x.NewBookIds)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, JsonSerializerOptions.Default),
                    v => JsonSerializer.Deserialize<Guid[]>(v, JsonSerializerOptions.Default) ?? Array.Empty<Guid>())
                .HasColumnType("jsonb");
        });
    }
}