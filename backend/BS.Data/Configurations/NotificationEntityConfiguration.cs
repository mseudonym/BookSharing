using BS.Data.Entities;
using BS.Data.Entities.Notifications.Base;
using BS.Data.Entities.Notifications.Friendship;
using BS.Data.Entities.Notifications.FriendUpdate;
using BS.Data.Entities.Notifications.Items;
using BS.Data.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BS.Data.Configurations;

public class NotificationEntityConfiguration : IEntityTypeConfiguration<NotificationEntityBase>
{
    public void Configure(EntityTypeBuilder<NotificationEntityBase> builder)
    {
        // Основная таблица для всех уведомлений (TPH)
        builder.ToTable(Tables.NotificationsTableName);

        builder.HasKey(n => n.Id);

        builder.Property(n => n.Id)
            .ValueGeneratedNever();

        builder.Property(n => n.CreatedAt)
            .IsRequired();

        // Дискриминатор для TPH
        var notificationTypeColumnName = "NotificationType";
        builder.HasDiscriminator<string>(notificationTypeColumnName)
            // Friendship
            .HasValueByTypeName<FriendshipRequestNotification>()
            .HasValueByTypeName<NewFriendNotification>()
            // Friends updates
            .HasValueByTypeName<FriendTakeBookToReadNotification>()
            .HasValueByTypeName<NewBooksInFriendShelfNotification>()
            // Items
            .HasValueByTypeName<SomeoneQueueToItemNotification>()
            .HasValueByTypeName<YourQueuePositionChangedNotification>()
            .HasValueByTypeName<SomeoneBecameHolderOfYourItemNotification>();

        builder.Property(notificationTypeColumnName)
            .HasColumnName(notificationTypeColumnName)
            .HasMaxLength(100)
            .IsRequired();

        // Внешний ключ на пользователя
        builder.HasOne(n => n.Recipient)
            .WithMany(u => u.Notifications)
            .HasForeignKey(n => n.RecipientId)
            .OnDelete(DeleteBehavior.Cascade);

        // Индексы для быстрого поиска и сортировки
        builder.HasIndex(n => n.RecipientId);
        builder.HasIndex(n => n.CreatedAt);
        builder.HasIndex(n => n.IsRead);
        builder.HasIndex(n => n.IsDeleted);
        builder.HasIndex(notificationTypeColumnName);
    }
}