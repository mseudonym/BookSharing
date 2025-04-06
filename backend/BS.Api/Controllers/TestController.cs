using BS.Core.Services.Email;
using Microsoft.AspNetCore.Mvc;

namespace BS.Api.Controllers;

[Route("[controller]")]
public class TestController : Controller
{
    private readonly EmailSender _emailSender;

    public TestController(EmailSender emailSender)
    {
        _emailSender = emailSender;
    }

    [HttpPost]
    [Route("sendEmail")]
    public async Task<IActionResult> SendEmail([FromForm] SendEmailModel model)
    {
        await using var stream = model.HtmlFile.OpenReadStream();
        using var reader = new StreamReader(stream);
        var htmlBody = await reader.ReadToEndAsync();
        
        await _emailSender.SendEmailAsync(model.RecipientEmail, model.Subject, htmlBody);
        
        return Ok("Email sent successfully.");
    }
    
    public class SendEmailModel
    {
        public required string RecipientEmail { get; init; }
        public required string Subject { get; init; } 
        public required IFormFile HtmlFile { get; init; }
    }
}