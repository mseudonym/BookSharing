using System.Net.Mail;
using BS.Core.Options;
using BS.Core.Services.Files;
using BS.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BS.Core.Services.Email;

public class EmailSender : IEmailSender<UserEntity>
{
    private readonly ILogger<EmailSender> _logger;
    private readonly EmailOptions _options;
    private readonly SmtpClient _smtpClient;

    public EmailSender(IOptions<EmailOptions> emailOptions, SmtpClient smtpClient, ILogger<EmailSender> logger)
    {
        _options = emailOptions.Value;
        _smtpClient = smtpClient;
        _smtpClient.EnableSsl = true;
        _logger = logger;
    }

    public async Task SendConfirmationLinkAsync(UserEntity user, string email, string confirmationLink)
    {
        var body = FilesProvider.GetEmailConfirmHtml(confirmationLink);
        const string subject = "Подтвердите подтвердите ваш email";
        
        await SendEmail(email, body, subject);
    }

    public Task SendPasswordResetLinkAsync(UserEntity user, string email, string resetLink)
    {
        throw new NotImplementedException();
    }

    public async Task SendPasswordResetCodeAsync(UserEntity user, string email, string resetCode)
    {
        var body = FilesProvider.GetResetCodeHtml(resetCode);
        const string subject = "Код для сброса пароля";
        
        await SendEmail(email, body, subject);
    }

    private async Task SendEmail(string email, string body, string subject)
    {
        var recipientMailAddress = new MailAddress(email);
        var message = new MailMessage(GetNoreplyMailAddress(), recipientMailAddress);
        
        message.Subject = subject;
        message.Body = body;
        message.IsBodyHtml = true;

        try
        {
            await _smtpClient.SendMailAsync(message);
            
            _logger.LogInformation($"Email with subject \"{subject}\" sent to {email}");
        }
        catch (Exception e)
        {
            _logger.LogError(e, e.Message);
        }
    }

    private MailAddress GetNoreplyMailAddress() => new(_options.NoreplyEmail, _options.DisplayName);
}