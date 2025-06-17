using BS.Data.Entities.Notifications.Base;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BS.Data.Extensions;

public static class DiscriminatorBuilderExtensions
{
    public static DiscriminatorBuilder<int> HasNotificationDiscriminator(
        this  EntityTypeBuilder<NotificationBaseEntity> builder,
        string notificationTypeColumnName
    )
    {
        var discriminatorBuilder = builder.HasDiscriminator<int>(notificationTypeColumnName);
        foreach (var (type, notificationType) in NotificationTypeMap.Map)
        {
            discriminatorBuilder.HasValue(type, (int)notificationType);
        }
        
        return discriminatorBuilder;
    }
}