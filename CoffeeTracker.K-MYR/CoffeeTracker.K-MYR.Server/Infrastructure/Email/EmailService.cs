using CoffeeTracker.K_MYR.RazorClassLib.Services;
using CoffeeTracker.K_MYR.RazorClassLib.Views.Models;
using CoffeeTracker.K_MYR.Server.Domain.Entities;
using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using MimeKit;

namespace CoffeeTracker.K_MYR.Server.Infrastructure.Email;

public class EmailService(IOptions<EmailConfiguration> emailConfiguration, IRazorViewToStringRenderer renderer) : IEmailSender<AppUser>
{
    private readonly EmailConfiguration _configuration = emailConfiguration.Value;
    private readonly IRazorViewToStringRenderer _renderer = renderer;

    public async Task SendConfirmationLinkAsync(AppUser user, string email, string confirmationLink)
    {        
        MimeMessage message = new();
        message.From.Add(new MailboxAddress(_configuration.SenderName, _configuration.SenderEmail));
        message.To.Add(new MailboxAddress(user.UserName, email));
        message.Subject = "Welcome to CoffeeTracker! Please Confirm Your Email";

        var body = await _renderer.RenderViewToStringAsync("Views/Emails/EmailConfirmation.cshtml", new EmailConfirmation(confirmationLink));
        var builder = new BodyBuilder()
        {
            HtmlBody = body
        };

        var brandPath = Path.Combine(AppContext.BaseDirectory, "Assets", "Images", "coffee-tracker-brand-with-glow.png");
        var brand = new MimePart("image", "png")
        {
            Content = new MimeContent(File.OpenRead(brandPath)),
            ContentId = "brand",
            ContentDisposition = new ContentDisposition(ContentDisposition.Inline),
            ContentTransferEncoding = ContentEncoding.Base64
        };
        builder.LinkedResources.Add(brand);
        var logoPath = Path.Combine(AppContext.BaseDirectory, "Assets", "Images", "coffee-logo-with-glow.png");
        var logo = new MimePart("image", "png")
        {
            Content = new MimeContent(File.OpenRead(logoPath)),
            ContentId = "logo",
            ContentDisposition = new ContentDisposition(ContentDisposition.Inline),
            ContentTransferEncoding = ContentEncoding.Base64
        };
        builder.LinkedResources.Add(logo);
        message.Body = builder.ToMessageBody();         
        
        using var client = new SmtpClient();
        await client.ConnectAsync(_configuration.SmtpServer, _configuration.SmtpPort);       
        await client.SendAsync(message);
        client.Disconnect(true);
    }

    public Task SendPasswordResetCodeAsync(AppUser user, string email, string resetCode)
    {
        throw new NotImplementedException();
    }

    public Task SendPasswordResetLinkAsync(AppUser user, string email, string resetLink)
    {
        throw new NotImplementedException();
    }
}
