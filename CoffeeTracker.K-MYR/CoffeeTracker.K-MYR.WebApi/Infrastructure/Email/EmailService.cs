using CoffeeTracker.K_MYR.Persistence.Entities;
using Microsoft.AspNetCore.Identity;
using System.Threading.Channels;

namespace CoffeeTracker.K_MYR.WebApi.Infrastructure.Email;

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

    public Task SendPasswordResetCodeAsync(AppUser user, string email, string resetCode)
    {
        throw new NotImplementedException();
    }

    public async Task SendPasswordResetLinkAsync(AppUser user, string email, string resetLink)
    {
        await _channel.Writer.WriteAsync(new EmailChannelRequest(user.UserName ?? email, email, resetLink, EmailTypes.PasswordResetCode));
    }
}
