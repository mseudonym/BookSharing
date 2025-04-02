namespace BS.Core.Services.User;

public interface ICurrentUserService
{
    public Task<Guid> GetIdAsync();
}