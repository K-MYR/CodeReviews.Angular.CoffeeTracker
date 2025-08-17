using CoffeeTracker.K_MYR.RazorClassLib.Services;
using CoffeeTracker.K_MYR.RazorClassLib.Views.Models;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;
using System.ComponentModel;
using System.Threading.Channels;

namespace CoffeeTracker.K_MYR.Server.Infrastructure.Email;

internal sealed class EmailProcessor(
    IOptions<EmailConfiguration> emailConfiguration,
    IRazorViewToStringRenderer renderer,
    ILogger<EmailProcessor> logger,
    Channel<EmailChannelRequest> channel) : BackgroundService
{
    private readonly EmailConfiguration _configuration = emailConfiguration.Value;
    private readonly IRazorViewToStringRenderer _renderer = renderer;
    private readonly ILogger<EmailProcessor> _logger = logger;
    private readonly Channel<EmailChannelRequest> _channel = channel;

    protected async override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            while (await _channel.Reader.WaitToReadAsync(stoppingToken))
            {
                var request = await _channel.Reader.ReadAsync(stoppingToken);
                MimeMessage message = request.EmailType switch
                {
                    EmailTypes.EmailConfirmation => await GenerateEmailConfirmationBody(request.UserName, request.Email, request.Link),
                    EmailTypes.PasswordResetCode => await GeneratePasswordResetBody(request.UserName, request.Email, request.Link),
                    _ => throw new InvalidEnumArgumentException("Invalid enum value", (int)request.EmailType, typeof(EmailTypes)),
                };

                await SendEmailAsync(message, stoppingToken);                
            }
        }
    }    

    private async Task SendEmailAsync(MimeMessage message, CancellationToken stoppingToken)   
    {
        int attempts = 0;
        while (attempts < RetryPolicyConstants.MaxRetryCount)
        {
            try
            {
                using var client = new SmtpClient();
                await client.ConnectAsync(_configuration.SmtpServer, _configuration.SmtpPort, cancellationToken: stoppingToken);
                if (!string.IsNullOrEmpty(_configuration.UserName) &&
                   !string.IsNullOrEmpty(_configuration.Password))
                {
                    await client.AuthenticateAsync(_configuration.UserName, _configuration.Password, stoppingToken);
                }
                await client.SendAsync(message);
                client.Disconnect(true, stoppingToken);
                return;
            }
            catch (Exception ex) 
            {
                attempts++;
                if (attempts == RetryPolicyConstants.MaxRetryCount)
                {
                    _logger.LogError("Failed to send email confirmation link after multiple attempts: {exception}", ex);
                }
            }
        }
    }

    private async Task<MimeMessage> GenerateEmailConfirmationBody(string userName, string userEmail, string confirmationLink)
    {
        MimeMessage message = new();
        message.From.Add(new MailboxAddress(_configuration.SenderName, _configuration.SenderEmail));
        message.To.Add(new MailboxAddress(userName, userEmail));
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
        return message;
    }

    private async Task<MimeMessage> GeneratePasswordResetBody(string userName, string userEmail, string resetLink)
    {
        MimeMessage message = new();
        message.From.Add(new MailboxAddress(_configuration.SenderName, _configuration.SenderEmail));
        message.To.Add(new MailboxAddress(userName, userEmail));
        message.Subject = "Your Password Reset Link";

        var body = await _renderer.RenderViewToStringAsync("Views/Emails/PasswordReset.cshtml", new PasswordReset(resetLink));
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
        return message;
    }
}

internal record EmailChannelRequest(string UserName, string Email, string Link, EmailTypes EmailType);
