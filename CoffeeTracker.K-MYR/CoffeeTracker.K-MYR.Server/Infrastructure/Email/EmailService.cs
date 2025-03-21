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
        message.Body = new TextPart(MimeKit.Text.TextFormat.Html)
        {
            Text = await _renderer.RenderViewToStringAsync("/Views/Emails/EmailConfirmation.cshtml", new EmailConfirmation(confirmationLink))
        };        
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
