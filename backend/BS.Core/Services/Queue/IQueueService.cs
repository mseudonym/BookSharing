using BS.Core.Models.Queue;
using FluentResults;

namespace BS.Core.Services.Queue;

public interface IQueueService
{
    public Task<Result<QueueModel>> GetQueueAsync(Guid itemId);
    public Task<Result<QueueModel>> EnqueueAsync(Guid itemId, bool isForcesFirstByOwner = false);
    public Task<Result> LeaveQueueAsync(Guid itemId);
    public Task<Result> MakeNextUserTheHolderAsync(Guid userId);
}