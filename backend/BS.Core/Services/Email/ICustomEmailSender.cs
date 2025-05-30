namespace BS.Core.Services.Email;

public interface ICustomEmailSender<in TUser> where TUser : class, new()
{
    Task SendConfirmationLinkAsync(TUser user, string email, string code, bool isChange = false);
    Task SendPasswordResetLinkAsync(TUser user, string email, string resetCode);
}