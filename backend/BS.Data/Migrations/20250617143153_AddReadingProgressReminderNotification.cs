using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BS.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddReadingProgressReminderNotification : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ReadingDays",
                table: "Notifications",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReadingDays",
                table: "Notifications");
        }
    }
}
