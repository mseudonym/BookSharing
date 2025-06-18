using BS.Data.Context;
using BS.Data.Entities.Notifications.Reminders;
using Microsoft.EntityFrameworkCore;

namespace BS.Core.Jobs;

public class HolderReadingReminderJob
{
    private readonly BookSharingContext _dbContext;
    private readonly TimeProvider _timeProvider;

    public HolderReadingReminderJob(BookSharingContext dbContext, TimeProvider timeProvider)
    {
        _dbContext = dbContext;
        _timeProvider = timeProvider;
    }

    public async Task RunAsync()
    {
        var now = _timeProvider.GetUtcNow().UtcDateTime.Date;
        const int batchSize = 500;
        var lastId = Guid.Empty;

        while (true)
        {
            // Загружаем порцию items, где holder != owner
            var id = lastId;
            var items = await _dbContext.Items
                .Where(i => i.HolderId != i.OwnerId && i.Id > id)
                .OrderBy(i => i.Id)
                .Take(batchSize)
                .ToListAsync();

            if (!items.Any())
                break;

            var itemIds = items.Select(i => i.Id).ToList();

            // Загружаем последние уведомления по item
            var lastNotifs = await _dbContext.Notifications
                .OfType<ReadingProgressReminderNotificationEntity>()
                .Where(n => itemIds.Contains(n.ItemId))
                .GroupBy(n => n.ItemId)
                .Select(g => new { g.Key, Last = g.Max(x => x.CreatedAt.Date) })
                .ToDictionaryAsync(x => x.Key, x => x.Last);

            var notifications = new List<ReadingProgressReminderNotificationEntity>();

            foreach (var item in items)
            {
                var heldDays = (now - item.HolderChangedUtc.Date).Days;
                if (heldDays < 7)
                    continue;

                var lastSentDate = lastNotifs.TryGetValue(item.Id, out var d) ? d : item.HolderChangedUtc.Date;
                var daysSinceLast = (now - lastSentDate).Days;

                // Сколько новых 7-дневных периодов прошло
                for (int i = 1; i * 7 <= heldDays && i * 7 <= heldDays + daysSinceLast; i++)
                {
                    var shouldBeCreatedAt = item.HolderChangedUtc.Date.AddDays(i * 7);

                    // Пропускаем если уже есть уведомление на этот день
                    if (shouldBeCreatedAt > now || (lastSentDate != default && shouldBeCreatedAt <= lastSentDate))
                        continue;

                    notifications.Add(new ReadingProgressReminderNotificationEntity
                    {
                        RecipientId = item.HolderId,
                        ItemId = item.Id,
                        CreatedAt = shouldBeCreatedAt,
                        ReadingDays = (shouldBeCreatedAt - item.HolderChangedUtc.Date).Days
                    });
                }
            }

            if (notifications.Any())
            {
                await _dbContext.Notifications.AddRangeAsync(notifications);
                await _dbContext.SaveChangesAsync();
            }

            lastId = items.Max(i => i.Id);
        }
    }
}
