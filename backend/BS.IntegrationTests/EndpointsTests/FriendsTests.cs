using BS.Core.Models.Notifications.Friendship;
using BS.Data.Entities.Notifications.Friendship;
using BS.IntegrationTests.Base;
using BS.IntegrationTests.Endpoints;
using Shouldly;

namespace BS.IntegrationTests.EndpointsTests;

public class FriendsTests : IntegrationTestsBase
{
    [Test]
    public async Task FriendRequestFlow_CreatesAndRemovesNotifications()
    {
        var clientA = await GetAuthClient();
        var clientB = await GetAuthClient();
        var userA = await UserEndpoints.GetUserData(clientA);
        var userB = await UserEndpoints.GetUserData(clientB);

        // A отправляет заявку B
        await FriendsEndpoints.SendFriendRequest(clientA, userB.Id);

        // B получает уведомление о входящей заявке
        var notificationsB = await NotificationEndpoints.GetNotifications(clientB);
        var income = notificationsB.OfType<FriendshipStatusChangedNotification>()
            .FirstOrDefault(n => !n.IsRead && n.PersonId == userA.Id);
        income.ShouldNotBeNull();
        income.NewStatus.ShouldBe(FriendshipStatus.IncomeRequest);

        // B принимает заявку
        await FriendsEndpoints.RespondToFriendRequest(clientB, userA.Id, true);

        // A получает уведомление о принятии
        var notificationsA = await NotificationEndpoints.GetNotifications(clientA);
        var notifAccepted = notificationsA.OfType<FriendshipStatusChangedNotification>()
            .FirstOrDefault(n => !n.IsRead && n.PersonId == userB.Id);
        notifAccepted.ShouldNotBeNull();
        notifAccepted.NewStatus.ShouldBe(FriendshipStatus.Friend);

        // A отмечает уведомления как прочитанные
        var unreadA = notificationsA.Where(n => !n.IsRead).Select(n => n.Id).ToArray();
        await NotificationEndpoints.MarkAsRead(clientA, unreadA);
        var afterMarkA = await NotificationEndpoints.GetNotifications(clientA);
        afterMarkA.Where(n => unreadA.Contains(n.Id)).All(n => n.IsRead).ShouldBeTrue();

        // A удаляет B из друзей
        await FriendsEndpoints.DeleteFriend(clientA, userB.Id);

        // Проверяем, что оба не друзья
        (await FriendsEndpoints.GetFriends(clientA)).ShouldNotContain(x => x.Id == userB.Id);
        (await FriendsEndpoints.GetFriends(clientB)).ShouldNotContain(x => x.Id == userA.Id);

        // Проверяем, что уведомлений о дружбе больше нет
        var notificationsA2 = await NotificationEndpoints.GetNotifications(clientA);
        var notificationsB2 = await NotificationEndpoints.GetNotifications(clientB);
        notificationsA2.Count(n => !n.IsRead && n is FriendshipStatusChangedNotification).ShouldBe(0);
        notificationsB2.Count(n => !n.IsRead && n is FriendshipStatusChangedNotification).ShouldBe(0);
    }

    [Test]
    public async Task FriendRequest_CanBeDeclined_AndNotInFriends()
    {
        var clientA = await GetAuthClient();
        var clientB = await GetAuthClient();
        var userA = await UserEndpoints.GetUserData(clientA);
        var userB = await UserEndpoints.GetUserData(clientB);

        // A отправляет заявку B
        await FriendsEndpoints.SendFriendRequest(clientA, userB.Id);
        // B получает уведомление о входящей заявке
        var notificationsB = await NotificationEndpoints.GetNotifications(clientB);
        var income = notificationsB.OfType<FriendshipStatusChangedNotification>()
            .FirstOrDefault(n => !n.IsRead && n.PersonId == userA.Id);
        income.ShouldNotBeNull();
        income.NewStatus.ShouldBe(FriendshipStatus.IncomeRequest);

        // B отклоняет заявку
        await FriendsEndpoints.RespondToFriendRequest(clientB, userA.Id, false);

        // Проверяем, что оба не друзья
        (await FriendsEndpoints.GetFriends(clientA)).ShouldNotContain(x => x.Id == userB.Id);
        (await FriendsEndpoints.GetFriends(clientB)).ShouldNotContain(x => x.Id == userA.Id);
        (await FriendsEndpoints.GetReceivedFriendRequests(clientB)).ShouldNotContain(x => x.Id == userA.Id);
        (await FriendsEndpoints.GetSentFriendRequests(clientA)).ShouldNotContain(x => x.Id == userB.Id);

        // Проверяем, что уведомление о входящей заявке исчезло
        var notificationsB2 = await NotificationEndpoints.GetNotifications(clientB);
        notificationsB2.Any(n => !n.IsRead && n is FriendshipStatusChangedNotification f && f.PersonId == userA.Id)
            .ShouldBeFalse();
    }

    [Test]
    public async Task FriendRequest_CanBeCancelledBySender()
    {
        var clientA = await GetAuthClient();
        var clientB = await GetAuthClient();
        var userA = await UserEndpoints.GetUserData(clientA);
        var userB = await UserEndpoints.GetUserData(clientB);

        await FriendsEndpoints.SendFriendRequest(clientA, userB.Id);
        // B получает уведомление о входящей заявке
        var notificationsB = await NotificationEndpoints.GetNotifications(clientB);
        var income = notificationsB.OfType<FriendshipStatusChangedNotification>()
            .FirstOrDefault(n => !n.IsRead && n.PersonId == userA.Id);
        income.ShouldNotBeNull();
        income.NewStatus.ShouldBe(FriendshipStatus.IncomeRequest);

        // A отменяет заявку
        await FriendsEndpoints.CancelFriendRequest(clientA, userB.Id);

        // Проверяем, что заявка исчезла у обоих
        (await FriendsEndpoints.GetSentFriendRequests(clientA)).ShouldNotContain(x => x.Id == userB.Id);
        (await FriendsEndpoints.GetReceivedFriendRequests(clientB)).ShouldNotContain(x => x.Id == userA.Id);

        // Проверяем, что уведомление о входящей заявке исчезло
        var notificationsB2 = await NotificationEndpoints.GetNotifications(clientB);
        notificationsB2.Any(n => !n.IsRead && n is FriendshipStatusChangedNotification f && f.PersonId == userA.Id)
            .ShouldBeFalse();
    }

    [Test]
    public async Task HandleFriendRequestTwice_OrToSelf()
    {
        var clientA = await GetAuthClient();
        var clientB = await GetAuthClient();
        var userA = await UserEndpoints.GetUserData(clientA);
        var userB = await UserEndpoints.GetUserData(clientB);

        await FriendsEndpoints.SendFriendRequest(clientA, userB.Id);
        // B получает уведомление о входящей заявке
        var notificationsB = await NotificationEndpoints.GetNotifications(clientB);
        var income = notificationsB.OfType<FriendshipStatusChangedNotification>()
            .FirstOrDefault(n => !n.IsRead && n.PersonId == userA.Id);
        income.ShouldNotBeNull();
        income.NewStatus.ShouldBe(FriendshipStatus.IncomeRequest);

        // Повторная заявка — должен быть 204
        var resp1 = await FriendsEndpoints.SendFriendRequestRaw(clientA, userB.Id);
        resp1.StatusCode.ShouldBe(System.Net.HttpStatusCode.NoContent);
        // Заявка самому себе — должен быть 400
        var resp2 = await FriendsEndpoints.SendFriendRequestRaw(clientA, userA.Id);
        resp2.StatusCode.ShouldBe(System.Net.HttpStatusCode.BadRequest);
    }

    [Test]
    public async Task CannotAcceptOrDeclineNonexistentRequest()
    {
        var clientA = await GetAuthClient();
        var clientB = await GetAuthClient();
        var userA = await UserEndpoints.GetUserData(clientA);

        // B пытается принять несуществующую заявку — должен быть 204
        var resp1 = await FriendsEndpoints.RespondToFriendRequestRaw(clientB, userA.Id, true);
        resp1.StatusCode.ShouldBe(System.Net.HttpStatusCode.NoContent);
        // B пытается отклонить несуществующую заявку — должен быть 204
        var resp2 = await FriendsEndpoints.RespondToFriendRequestRaw(clientB, userA.Id, false);
        resp2.StatusCode.ShouldBe(System.Net.HttpStatusCode.NoContent);

        // Проверяем, что уведомлений не появилось
        var notificationsB = await NotificationEndpoints.GetNotifications(clientB);
        notificationsB.Any(n => !n.IsRead && n is FriendshipStatusChangedNotification f && f.PersonId == userA.Id)
            .ShouldBeFalse();
    }
}