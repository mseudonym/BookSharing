using BS.Core.Models.Items;
using FluentResults;

namespace BS.Core.Services.Items;

public interface IItemService
{
    public Task<Result<ItemInfo[]>> GetMyItems();
    public Task<Result<ItemInfo[]>> GetFriendsItems();
    public Task<Result<ItemModel?>> GetMyItemByBook(Guid bookId);
    public Task<Result<ItemModel[]>> GetFriendItemsByBook(Guid bookId);
    public Task<Result> AddToMyShelf(Guid bookId);
    public Task<Result> RemoveFromMyShelf(Guid bookId);
    public Task<Result> EnqueueAsync(Guid itemId, bool isForcesFirstByOwner = false);
    public Task<Result> LeaveQueueAsync(Guid itemId);
    public Task<Result> BecameHolderAsync(Guid userId);
}