using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BS.Data.Migrations
{
    /// <inheritdoc />
    public partial class ChangeNotificationEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Books_Notifications_NewBooksInFriendShelfNotificationId",
                table: "Books");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_AspNetUsers_ItemId",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_AspNetUsers_SomeoneBecameHolderOfYourItemNoti~",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_AspNetUsers_SomeoneQueueToItemNotification_Bo~",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_AspNetUsers_YourQueuePositionChangedNotificat~",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_SomeoneBecameHolderOfYourItemNotification_Boo~",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_SomeoneQueueToItemNotification_BookId",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_YourQueuePositionChangedNotification_BookId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "SomeoneBecameHolderOfYourItemNotification_BookId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "SomeoneQueueToItemNotification_BookId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "YourQueuePositionChangedNotification_BookId",
                table: "Notifications");

            migrationBuilder.RenameColumn(
                name: "NewBooksInFriendShelfNotificationId",
                table: "Books",
                newName: "NewBooksInFriendShelfNotificationEntityId");

            migrationBuilder.RenameIndex(
                name: "IX_Books_NewBooksInFriendShelfNotificationId",
                table: "Books",
                newName: "IX_Books_NewBooksInFriendShelfNotificationEntityId");

            migrationBuilder.AddColumn<int>(
                name: "NewStatus",
                table: "Notifications",
                type: "integer",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Books_Notifications_NewBooksInFriendShelfNotificationEntity~",
                table: "Books",
                column: "NewBooksInFriendShelfNotificationEntityId",
                principalTable: "Notifications",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Items_ItemId",
                table: "Notifications",
                column: "ItemId",
                principalTable: "Items",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Books_Notifications_NewBooksInFriendShelfNotificationEntity~",
                table: "Books");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Items_ItemId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "NewStatus",
                table: "Notifications");

            migrationBuilder.RenameColumn(
                name: "NewBooksInFriendShelfNotificationEntityId",
                table: "Books",
                newName: "NewBooksInFriendShelfNotificationId");

            migrationBuilder.RenameIndex(
                name: "IX_Books_NewBooksInFriendShelfNotificationEntityId",
                table: "Books",
                newName: "IX_Books_NewBooksInFriendShelfNotificationId");

            migrationBuilder.AddColumn<Guid>(
                name: "SomeoneBecameHolderOfYourItemNotification_BookId",
                table: "Notifications",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "SomeoneQueueToItemNotification_BookId",
                table: "Notifications",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "YourQueuePositionChangedNotification_BookId",
                table: "Notifications",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_SomeoneBecameHolderOfYourItemNotification_Boo~",
                table: "Notifications",
                column: "SomeoneBecameHolderOfYourItemNotification_BookId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_SomeoneQueueToItemNotification_BookId",
                table: "Notifications",
                column: "SomeoneQueueToItemNotification_BookId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_YourQueuePositionChangedNotification_BookId",
                table: "Notifications",
                column: "YourQueuePositionChangedNotification_BookId");

            migrationBuilder.AddForeignKey(
                name: "FK_Books_Notifications_NewBooksInFriendShelfNotificationId",
                table: "Books",
                column: "NewBooksInFriendShelfNotificationId",
                principalTable: "Notifications",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_AspNetUsers_ItemId",
                table: "Notifications",
                column: "ItemId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_AspNetUsers_SomeoneBecameHolderOfYourItemNoti~",
                table: "Notifications",
                column: "SomeoneBecameHolderOfYourItemNotification_BookId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_AspNetUsers_SomeoneQueueToItemNotification_Bo~",
                table: "Notifications",
                column: "SomeoneQueueToItemNotification_BookId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_AspNetUsers_YourQueuePositionChangedNotificat~",
                table: "Notifications",
                column: "YourQueuePositionChangedNotification_BookId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
