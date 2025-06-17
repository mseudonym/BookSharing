using BS.Core.Models.Notifications.Base;

namespace BS.Core.Models.Notifications.Reminders;

public class ReadingProgressReminderNotification : NotificationBase
{
    public required int ReadingDays { get; set; }
}