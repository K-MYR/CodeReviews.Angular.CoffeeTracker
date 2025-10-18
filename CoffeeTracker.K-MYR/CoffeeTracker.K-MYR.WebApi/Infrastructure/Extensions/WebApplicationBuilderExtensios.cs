using CoffeeTracker.K_MYR.Common;
using CoffeeTracker.K_MYR.WebApi.Infrastructure.ClientApp;
using CoffeeTracker.K_MYR.WebApi.Infrastructure.Email;

namespace CoffeeTracker.K_MYR.WebApi.Infrastructure.Extensions;
internal static class WebApplicationBuilderExtensions
{
    public static WebApplicationBuilder ConfigureEmailOptions(this WebApplicationBuilder builder)
    {
        var options = builder.Configuration.GetRequiredSection(EmailConfigurationSettings.Key)
            .Get<EmailConfigurationSettings>();
        ArgumentNullException.ThrowIfNull(options);

        var connectionString = builder.Configuration.GetConnectionString(ResourceNames.Papercut);

        if (connectionString is not null)
        {
            var dict = StringHelpers.ConnectionStringToDictionary(connectionString);
            if (dict.TryGetValue("Endpoint", out var value) && Uri.TryCreate(value, UriKind.Absolute, out var uri))
            {
                options.SmtpServer = uri.Host;
                options.SmtpPort = uri.Port;
            }
        }

        if (options.SmtpPort is null || options.SmtpServer is null)
        {
            throw new InvalidOperationException("SMTP server and port configurations are required");
        }

        builder.Services.Configure<EmailConfiguration>(opt =>
        {
            opt.SmtpServer = options.SmtpServer;
            opt.SmtpPort = options.SmtpPort.Value;
            opt.UserName = options.UserName;
            opt.Password = options.Password;
            opt.SenderName = options.SenderName;
            opt.SenderEmail = options.SenderEmail;
        });

        return builder;
    }

    public static WebApplicationBuilder ConfigureClientOptions(this WebApplicationBuilder builder)
    {
        var options = builder.Configuration.GetRequiredSection(ClientAppConfigurationSettings.Key)
            .Get<ClientAppConfigurationSettings>();
        ArgumentNullException.ThrowIfNull(options);


        var httpsPorts = builder.Configuration.GetRequiredSection($"services:{ResourceNames.AngularApp}:https")
            .GetChildren()
            .Select(c => c.Value)
            .ToArray();

        if (!(httpsPorts.Length > 0
            && Uri.TryCreate(httpsPorts[0], UriKind.Absolute, out Uri? uri))
            && !Uri.TryCreate(options.Uri, UriKind.Absolute, out uri))
        {
            throw new InvalidOperationException("SMTP server and port configurations are required");
        }   

        builder.Services.Configure<ClientAppConfiguration>(opt => 
        {
            opt.ConfirmEmailEndpoint = new UriBuilder(uri)
            {
                Path = options.ConfirmEmailEndpoint
            }.Uri;
            opt.ResetPasswordEndpoint = new UriBuilder(uri)
            {
                Path = options.ResetPasswordEndpoint
            }.Uri;
        });
        return builder;
    }
}
