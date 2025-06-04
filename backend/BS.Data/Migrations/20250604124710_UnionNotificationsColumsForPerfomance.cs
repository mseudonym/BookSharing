using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BS.Data.Migrations
{
    /// <inheritdoc />
    public partial class UnionNotificationsColumsForPerfomance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Books_Notifications_NewBooksInFriendShelfNotificationEntity~",
                table: "Books");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_AspNetUsers_FriendId",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_AspNetUsers_NewHolderId",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_AspNetUsers_NewQueueMemberId",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_AspNetUsers_PersonId",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Books_BookId",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Items_ItemId",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_FriendId",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_NewHolderId",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_NewQueueMemberId",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Books_NewBooksInFriendShelfNotificationEntityId",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "FriendId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "NewHolderId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "NewQueueMemberId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "NewBooksInFriendShelfNotificationEntityId",
                table: "Books");

            migrationBuilder.AddColumn<string>(
                name: "NewBookIds",
                table: "Notifications",
                type: "jsonb",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_AspNetUsers_PersonId",
                table: "Notifications",
                column: "PersonId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Books_BookId",
                table: "Notifications",
                column: "BookId",
                principalTable: "Books",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Items_ItemId",
                table: "Notifications",
                column: "ItemId",
                principalTable: "Items",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_AspNetUsers_PersonId",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Books_BookId",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Items_ItemId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "NewBookIds",
                table: "Notifications");

            migrationBuilder.AddColumn<Guid>(
                name: "FriendId",
                table: "Notifications",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "NewHolderId",
                table: "Notifications",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "NewQueueMemberId",
                table: "Notifications",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "NewBooksInFriendShelfNotificationEntityId",
                table: "Books",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_FriendId",
                table: "Notifications",
                column: "FriendId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_NewHolderId",
                table: "Notifications",
                column: "NewHolderId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_NewQueueMemberId",
                table: "Notifications",
                column: "NewQueueMemberId");

            migrationBuilder.CreateIndex(
                name: "IX_Books_NewBooksInFriendShelfNotificationEntityId",
                table: "Books",
                column: "NewBooksInFriendShelfNotificationEntityId");

            migrationBuilder.AddForeignKey(
                name: "FK_Books_Notifications_NewBooksInFriendShelfNotificationEntity~",
                table: "Books",
                column: "NewBooksInFriendShelfNotificationEntityId",
                principalTable: "Notifications",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_AspNetUsers_FriendId",
                table: "Notifications",
                column: "FriendId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_AspNetUsers_NewHolderId",
                table: "Notifications",
                column: "NewHolderId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_AspNetUsers_NewQueueMemberId",
                table: "Notifications",
                column: "NewQueueMemberId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_AspNetUsers_PersonId",
                table: "Notifications",
                column: "PersonId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Books_BookId",
                table: "Notifications",
                column: "BookId",
                principalTable: "Books",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Items_ItemId",
                table: "Notifications",
                column: "ItemId",
                principalTable: "Items",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
