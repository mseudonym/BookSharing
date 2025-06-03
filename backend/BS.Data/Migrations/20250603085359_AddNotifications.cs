using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BS.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddNotifications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Items_AspNetUsers_UserEntityId",
                table: "Items");

            migrationBuilder.DropIndex(
                name: "IX_Items_UserEntityId",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "UserEntityId",
                table: "Items");

            migrationBuilder.AddColumn<Guid>(
                name: "NewBooksInFriendShelfNotificationId",
                table: "Books",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    RecipientId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsRead = table.Column<bool>(type: "boolean", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    NotificationType = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    BookId = table.Column<Guid>(type: "uuid", nullable: true),
                    FriendId = table.Column<Guid>(type: "uuid", nullable: true),
                    PersonId = table.Column<Guid>(type: "uuid", nullable: true),
                    NewHolderId = table.Column<Guid>(type: "uuid", nullable: true),
                    ItemId = table.Column<Guid>(type: "uuid", nullable: true),
                    SomeoneBecameHolderOfYourItemNotification_BookId = table.Column<Guid>(type: "uuid", nullable: true),
                    NewQueueMemberId = table.Column<Guid>(type: "uuid", nullable: true),
                    SomeoneQueueToItemNotification_BookId = table.Column<Guid>(type: "uuid", nullable: true),
                    NewPosition = table.Column<int>(type: "integer", nullable: true),
                    YourQueuePositionChangedNotification_BookId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Notifications_AspNetUsers_FriendId",
                        column: x => x.FriendId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Notifications_AspNetUsers_ItemId",
                        column: x => x.ItemId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Notifications_AspNetUsers_NewHolderId",
                        column: x => x.NewHolderId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Notifications_AspNetUsers_NewQueueMemberId",
                        column: x => x.NewQueueMemberId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Notifications_AspNetUsers_PersonId",
                        column: x => x.PersonId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Notifications_AspNetUsers_RecipientId",
                        column: x => x.RecipientId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Notifications_AspNetUsers_SomeoneBecameHolderOfYourItemNoti~",
                        column: x => x.SomeoneBecameHolderOfYourItemNotification_BookId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Notifications_AspNetUsers_SomeoneQueueToItemNotification_Bo~",
                        column: x => x.SomeoneQueueToItemNotification_BookId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Notifications_AspNetUsers_YourQueuePositionChangedNotificat~",
                        column: x => x.YourQueuePositionChangedNotification_BookId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Notifications_Books_BookId",
                        column: x => x.BookId,
                        principalTable: "Books",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Books_NewBooksInFriendShelfNotificationId",
                table: "Books",
                column: "NewBooksInFriendShelfNotificationId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_BookId",
                table: "Notifications",
                column: "BookId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_CreatedAt",
                table: "Notifications",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_FriendId",
                table: "Notifications",
                column: "FriendId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_IsDeleted",
                table: "Notifications",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_IsRead",
                table: "Notifications",
                column: "IsRead");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_ItemId",
                table: "Notifications",
                column: "ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_NewHolderId",
                table: "Notifications",
                column: "NewHolderId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_NewQueueMemberId",
                table: "Notifications",
                column: "NewQueueMemberId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_NotificationType",
                table: "Notifications",
                column: "NotificationType");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_PersonId",
                table: "Notifications",
                column: "PersonId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_RecipientId",
                table: "Notifications",
                column: "RecipientId");

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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Books_Notifications_NewBooksInFriendShelfNotificationId",
                table: "Books");

            migrationBuilder.DropTable(
                name: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Books_NewBooksInFriendShelfNotificationId",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "NewBooksInFriendShelfNotificationId",
                table: "Books");
            
            migrationBuilder.AddColumn<Guid>(
                name: "UserEntityId",
                table: "Items",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Items_UserEntityId",
                table: "Items",
                column: "UserEntityId");

            migrationBuilder.AddForeignKey(
                name: "FK_Items_AspNetUsers_UserEntityId",
                table: "Items",
                column: "UserEntityId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
