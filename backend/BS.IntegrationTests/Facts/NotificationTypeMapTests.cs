using BS.Data.Entities.Notifications.Base;

namespace BS.IntegrationTests.Facts;

[TestFixture]
public class NotificationTypeMapTests
{
    [Test]
    public void AllNotificationTypes_Should_Have_CorrespondingUniquTypeMappings()
    {
        var allEnumValues = Enum.GetValues(typeof(NotificationType)).Cast<NotificationType>().ToHashSet();
        var mappedValues = NotificationTypeMap.Map.Select(m => m.NotificationType).ToHashSet();

        var missing = allEnumValues.Except(mappedValues).ToList();

        Assert.IsEmpty(missing, $"Missing mappings for NotificationTypes: {string.Join(", ", missing)}");
        
        var duplicateTypes = NotificationTypeMap.Map
            .GroupBy(m => m.NotificationType)
            .Where(g => g.Count() > 1)
            .Select(g => g.Key)
            .ToList();

        Assert.IsEmpty(duplicateTypes, $"Duplicate mappings found for: {string.Join(", ", duplicateTypes)}");
    }
}