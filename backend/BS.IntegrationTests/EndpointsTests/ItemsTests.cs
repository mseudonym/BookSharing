using BS.IntegrationTests.Base;
using BS.IntegrationTests.Endpoints;
using Shouldly;
using BS.Core.Models.Notifications.FriendUpdate;
using BS.IntegrationTests.DataGenerator;

namespace BS.IntegrationTests.EndpointsTests;

public class ItemsTests : IntegrationTestsBase
{
    [Test]
    public async Task AddToMyShelf_ShouldCreateItem_AndNotifyFriends()
    {
        var clientA = await GetAuthClient();
        var clientB = await GetAuthClient();
        var userA = await UserEndpoints.GetUserData(clientA);
        var userB = await UserEndpoints.GetUserData(clientB);

        // Подружить пользователей
        await FriendsEndpoints.SendFriendRequest(clientA, userB.Id);
        await FriendsEndpoints.RespondToFriendRequest(clientB, userA.Id, true);

        // Добавить книгу (предположим, что AddBook возвращает bookId)
        var bookId = await BooksEndpoints.AddBook(clientA, BookGenerator.CreateValidBookRequest());

        await ItemsEndpoints.AddToMyShelf(clientA, bookId);

        // Проверить, что предмет появился у пользователя
        var myItems = await ItemsEndpoints.GetMyItems(clientA);
        myItems.ShouldContain(x => x.Book.Id == bookId);

        // Проверить, что у друга появилось уведомление о новой книге
        var notifications = await NotificationEndpoints.GetNotifications(clientB);
        notifications.OfType<NewBooksInFriendShelfNotification>()
            .Any(n => n.FriendId == userA.Id).ShouldBeTrue();
    }

    [Test]
    public async Task GetBookItems_ShouldReturnNullIfNotExists_AndItemIfExists()
    {
        var client = await GetAuthClient();
        var user = await UserEndpoints.GetUserData(client);
        var bookId = Guid.NewGuid();
        var item = await ItemsEndpoints.GetBookItems(client, bookId);
        item.ShouldBeNull();
        bookId = await BooksEndpoints.AddBook(client, BookGenerator.CreateValidBookRequest());
        await ItemsEndpoints.AddToMyShelf(client, bookId);
        item = await ItemsEndpoints.GetBookItems(client, bookId);
        item.ShouldNotBeNull();
        item!.Holder.Id.ShouldBe(user.Id);
    }

    // TODO: реализовать остальные тесты по плану
} 