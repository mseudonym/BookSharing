using FluentResults;

namespace BS.Core.Services.Queue;

public interface IQueueService
{
    public Task<Result> EnqueueAsync(Guid itemId, bool isForcesFirstByOwner = false);
    public Task<Result> LeaveQueueAsync(Guid itemId);
    public Task<Result> MakeNextUserTheHolderAsync(Guid userId);
}