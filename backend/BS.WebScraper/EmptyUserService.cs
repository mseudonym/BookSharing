using BS.Core.Services.User;

namespace BS.WebScraper;

public class EmptyUserService : ICurrentUserService
{
    public Task<Guid> GetIdAsync() => Task.FromResult(Guid.Empty);
}