using BS.Core.Models.Items;
using BS.Core.Models.Queue;
using FluentResults;

namespace BS.Core.Services.Items;

public interface IItemService
{
    public Task<Result<MyItemInfo[]>> GetMyItemsWithHolderAsync();
    public Task<Result<FriendItemInfo[]>> GetItemsCurrentUserHoldAsync();
    public Task<Result<QueueModel[]>> GetAllQueuesOfBook(Guid bookId);
    public Task<Result> AddToMyShelf(Guid bookId);
}