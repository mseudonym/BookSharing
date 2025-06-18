using BS.Data.Entities.Notifications.Base;

namespace BS.Data.Entities.Notifications.Reminders;

public class ReadingProgressReminderNotificationEntity : ItemNotificationBaseEntity
{
    public required int ReadingDays { get; set; }
}