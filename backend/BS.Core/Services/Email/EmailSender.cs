using System.Net.Mail;
using BS.Core.Options;
using BS.Core.Services.Files;
using BS.Data.Entities;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Polly;

namespace BS.Core.Services.Email;

public class EmailSender : ICustomEmailSender<UserEntity>
{
    private readonly ILogger<EmailSender> _logger;
    private readonly EmailOptions _options;
    private readonly FrontendOptions _frontendOptions;
    private readonly SmtpClient _smtpClient;

    public EmailSender(IOptions<EmailOptions> emailOptions, IOptions<FrontendOptions> frontendOptions,
        SmtpClient smtpClient, ILogger<EmailSender> logger)
    {
        _options = emailOptions.Value;
        _frontendOptions = frontendOptions.Value;
        _smtpClient = smtpClient;
        _smtpClient.EnableSsl = true;
        _logger = logger;
    }

    public async Task SendConfirmationLinkAsync(UserEntity user, string email, string code, bool isChange = false)
    {
        var parameters = $"?userId={Uri.EscapeDataString(user.Id.ToString())}&code={Uri.EscapeDataString(code)}";

        if (isChange)
        {
            var emailChangeLink = $"{_frontendOptions.Url}/{_frontendOptions.EmailConfirmPath}" +
                                  parameters + $"&email={Uri.EscapeDataString(email)}";
            var emailChangeHtml = ResourceProvider.GetEmailChangeHtml(emailChangeLink);
            await SendEmail(email, "Подтвердите изменение почты", emailChangeHtml);

            return;
        }

        var emailConfirmLink = $"{_frontendOptions.Url}/{_frontendOptions.EmailConfirmPath}" + parameters;
        var emailConfirmHtml = ResourceProvider.GetEmailConfirmHtml(emailConfirmLink);
        await SendEmail(email, "Подтвердите ваш email", emailConfirmHtml);
    }
    
    public async Task SendPasswordResetLinkAsync(UserEntity user, string email, string resetCode)
    {
        var passwordResetLink = $"{_frontendOptions.Url}/{_frontendOptions.PasswordResetPath}" +
                                $"?code={resetCode}";

        var body = ResourceProvider.GetPasswordResetHtml(passwordResetLink);
        const string subject = "Код для сброса пароля";

        await SendEmail(email, subject, body);
    }

    private async Task SendEmail(string email, string subject, string body)
    {
        var recipientMailAddress = new MailAddress(email);
        var message = new MailMessage(GetNoreplyMailAddress(), recipientMailAddress);

        message.Subject = subject;
        message.Body = body;
        message.IsBodyHtml = true;

        const int retryCount = 3;
        var result = await Policy
            .Handle<SmtpException>()
            .WaitAndRetryAsync(retryCount, retryAttempt => TimeSpan.FromSeconds(2 * retryAttempt),
                (exception, _, count, _) => _logger.LogInformation(
                    $"Retry {count} for sending email to {email} due to {exception.Message}"))
            .ExecuteAndCaptureAsync(async () =>
            {
                await _smtpClient.SendMailAsync(message);

                _logger.LogInformation($"Email with subject \"{subject}\" sent to {email}");
            });

        if (result.Outcome is OutcomeType.Failure)
        {
            _logger.LogError("Cannot send email to {email} due to {exception}", email, result.FinalException.Message);
        }
    }

    private MailAddress GetNoreplyMailAddress() => new(_options.NoreplyEmail, _options.DisplayName);
}