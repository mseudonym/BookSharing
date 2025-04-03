using System.Net.Mail;
using BS.Core.Options;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BS.Core.Services.Email;

public class EmailSender : IEmailSender
{
    private readonly ILogger<EmailSender> _logger;
    private readonly EmailOptions _options;
    private readonly SmtpClient _smtpClient;

    public EmailSender(IOptions<EmailOptions> emailOptions, SmtpClient smtpClient, ILogger<EmailSender> logger)
    {
        _options = emailOptions.Value;
        _smtpClient = smtpClient;
        _logger = logger;
    }

    public async Task SendEmailAsync(string email, string subject, string htmlMessage)
    {
        var recipientMailAddress = new MailAddress(email);
        var message = new MailMessage(GetNoreplyMailAddress(), recipientMailAddress)
        {
            Subject = subject,
            Body = htmlMessage,
        };
        message.IsBodyHtml = true;

        try
        {
            await _smtpClient.SendMailAsync(message);
            _logger.LogInformation($"Email sent to {email}");
        }
        catch (Exception e)
        {
            _logger.LogError(e, e.Message);
        }
    }

    private MailAddress GetNoreplyMailAddress() => new(_options.NoreplyEmail, _options.DisplayName);
}