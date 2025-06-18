using BS.Core.Models.Notifications.Items;

namespace BS.Core.Models.Notifications.Reminders;

public class ReadingProgressReminderNotification : ItemNotificationBase
{
    public required int ReadingDays { get; set; }
}