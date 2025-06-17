using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BS.Data.Migrations
{
    public partial class UpdateNotificationTypeColumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
ALTER TABLE ""Notifications""
ALTER COLUMN ""NotificationType"" TYPE integer USING
  CASE ""NotificationType""
    WHEN 'FriendshipStatusChangedNotificationEntity' THEN 0
    WHEN 'FriendTakeBookToReadNotificationEntity' THEN 1
    WHEN 'NewBooksInFriendShelfNotificationEntity' THEN 2
    WHEN 'SomeoneBecameHolderOfYourItemNotificationEntity' THEN 3
    WHEN 'SomeoneQueueToItemNotificationEntity' THEN 4
    WHEN 'YourQueuePositionChangedNotificationEntity' THEN 5
    ELSE NULL
  END;
");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
ALTER TABLE ""Notifications""
ALTER COLUMN ""NotificationType"" TYPE varchar(100) USING
  CASE ""NotificationType""
    WHEN 0 THEN 'FriendshipStatusChangedNotificationEntity'
    WHEN 1 THEN 'FriendTakeBookToReadNotificationEntity'
    WHEN 2 THEN 'NewBooksInFriendShelfNotificationEntity'
    WHEN 3 THEN 'SomeoneBecameHolderOfYourItemNotificationEntity'
    WHEN 4 THEN 'SomeoneQueueToItemNotificationEntity'
    WHEN 5 THEN 'YourQueuePositionChangedNotificationEntity'
    ELSE NULL
  END;
");
        }
    }
}