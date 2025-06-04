using BS.Core.Models.Notifications.Base;
using BS.Core.Models.Notifications.Items;
using BS.Core.Models.Notifications.FriendUpdate;
using BS.Core.Models.Notifications.Friendship;
using BS.Data.Entities.Notifications.Base;
using BS.Data.Entities.Notifications.Items;
using BS.Data.Entities.Notifications.FriendUpdate;
using BS.Data.Entities.Notifications.Friendship;
using BS.Core.Models.Mapping;

namespace BS.Core.Models.Mapping;

public class NotificationMapper
{
    private readonly UserMapper _userMapper;
    private readonly BookMapper _bookMapper;

    public NotificationMapper(UserMapper userMapper, BookMapper bookMapper)
    {
        _userMapper = userMapper;
        _bookMapper = bookMapper;
    }

    public NotificationBase ToModel(NotificationBaseEntity entity)
    {
        switch (entity)
        {
            case SomeoneBecameHolderOfYourItemNotificationEntity e:
                return new SomeoneBecameHolderOfYourItemNotification
                {
                    Id = e.Id,
                    CreatedAt = e.CreatedAt,
                    IsRead = e.IsRead,
                    ItemId = e.ItemId,
                    BookId = e.BookId,
                    Book = _bookMapper.ToBookModel(e.Book),
                    NewHolder = _userMapper.ToUserProfile(e.NewHolder, default)
                };
            case SomeoneQueueToItemNotificationEntity e:
                return new SomeoneQueueToItemNotification
                {
                    Id = e.Id,
                    CreatedAt = e.CreatedAt,
                    IsRead = e.IsRead,
                    ItemId = e.ItemId,
                    BookId = e.BookId,
                    Book = _bookMapper.ToBookModel(e.Book),
                    NewQueueMember = _userMapper.ToUserProfile(e.NewQueueMember, default)
                };
            case YourQueuePositionChangedNotificationEntity e:
                return new YourQueuePositionChangedNotification
                {
                    Id = e.Id,
                    CreatedAt = e.CreatedAt,
                    IsRead = e.IsRead,
                    ItemId = e.ItemId,
                    BookId = e.BookId,
                    Book = _bookMapper.ToBookModel(e.Book),
                    NewPosition = e.NewPosition
                };
            case FriendTakeBookToReadNotificationEntity e:
                return new FriendTakeBookToReadNotification
                {
                    Id = e.Id,
                    CreatedAt = e.CreatedAt,
                    IsRead = e.IsRead,
                    FriendId = e.FriendId,
                    Friend = _userMapper.ToUserProfile(e.Friend, default),
                    Book = _bookMapper.ToBookModel(e.Book)
                };
            case NewBooksInFriendShelfNotificationEntity e:
                return new NewBooksInFriendShelfNotification
                {
                    Id = e.Id,
                    CreatedAt = e.CreatedAt,
                    IsRead = e.IsRead,
                    FriendId = e.FriendId,
                    Friend = _userMapper.ToUserProfile(e.Friend, default),
                    NewBooks = e.NewBooks.Select(book => _bookMapper.ToBookModel(book)).ToList()
                };
            case FriendshipStatusChangedNotificationEntity e:
                return new FriendshipStatusChangedNotification
                {
                    Id = e.Id,
                    CreatedAt = e.CreatedAt,
                    IsRead = e.IsRead,
                    PersonId = e.PersonId,
                    Person = _userMapper.ToUserProfile(e.Person, e.NewStatus),
                    NewStatus = e.NewStatus
                };
            default:
                throw new NotSupportedException($"Unknown notification entity type: {entity.GetType().Name}");
        }
    }

    public NotificationBase[] ToModel(IEnumerable<NotificationBaseEntity> entities)
        => entities.Select(ToModel).ToArray();
} 