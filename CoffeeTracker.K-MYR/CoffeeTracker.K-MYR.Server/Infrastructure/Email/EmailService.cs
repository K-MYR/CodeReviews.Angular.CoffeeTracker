using CoffeeTracker.K_MYR.Server.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using System.Threading.Channels;

namespace CoffeeTracker.K_MYR.Server.Infrastructure.Email;

internal class EmailService(
    Channel<EmailChannelRequest> channel,
    ILogger<EmailService> logger) : IEmailSender<AppUser>
{
    private readonly Channel<EmailChannelRequest> _channel = channel;
    private readonly ILogger<EmailService> _logger = logger;

    public async Task SendConfirmationLinkAsync(AppUser user, string email, string confirmationLink)
    {
        await _channel.Writer.WriteAsync(new EmailChannelRequest(user.UserName ?? email, email, confirmationLink, EmailTypes.EmailConfirmation));
    }

    public async Task SendPasswordResetCodeAsync(AppUser user, string email, string resetCode)
    {
        await _channel.Writer.WriteAsync(new EmailChannelRequest(user.UserName ?? email, email, resetCode, EmailTypes.PasswordResetCode));
    }

    public Task SendPasswordResetLinkAsync(AppUser user, string email, string resetLink)
    {
        throw new NotImplementedException();
    }
}
