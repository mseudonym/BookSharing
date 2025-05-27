using BS.Core.Models.Items;
using BS.Core.Models.Queue;
using FluentResults;

namespace BS.Core.Services.Items;

public interface IItemService
{
    public Task<Result<ItemModel>> GetItemAsync(Guid itemId);
    public Task<Result<MyItemInfo[]>> GetMyItemsWithHolderAsync();
    public Task<Result<FriendItemInfo[]>> GetItemsCurrentUserHoldAsync();
    public Task<Result<ItemModel?>> GetMyItemByBook(Guid bookId);
    public Task<Result<ItemModel[]>> GetFriendItemsByBook(Guid bookId);
    public Task<Result> AddToMyShelf(Guid bookId);
    public Task<Result> RemoveFromMyShelf(Guid bookId);
}