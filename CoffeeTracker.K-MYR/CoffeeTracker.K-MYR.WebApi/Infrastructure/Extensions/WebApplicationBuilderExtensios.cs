using CoffeeTracker.K_MYR.Common;
using CoffeeTracker.K_MYR.WebApi.Infrastructure.Email;

namespace CoffeeTracker.K_MYR.WebApi.Infrastructure.Extensions;
public static class WebApplicationBuilderExtensions
{
    public static WebApplicationBuilder ConfigureEmailOptions(this WebApplicationBuilder builder)
    {
        var myoptions = builder.Configuration.GetSection(EmailConfiguration.Key)
            .Get<EmailConfiguration>();
        ArgumentNullException.ThrowIfNull(myoptions);

        var connectionString = builder.Configuration.GetConnectionString(ResourceNames.Papercut);
        ArgumentNullException.ThrowIfNull(connectionString);

        var dict = StringHelpers.ConnectionStringToDictionary(connectionString);
        if (dict.TryGetValue("Endpoint", out var value) && Uri.TryCreate(value, UriKind.Absolute, out var uri))
        {
            myoptions.SmtpServer = uri.Host;
            myoptions.SmtpPort = uri.Port;
        }

        builder.Services.Configure<EmailConfiguration>(options =>
        {
            options.SmtpServer = myoptions.SmtpServer;
            options.SmtpPort = myoptions.SmtpPort;
            options.UserName = myoptions.UserName;
            options.Password = myoptions.Password;
            options.SenderName = myoptions.SenderName;
            options.SenderEmail = myoptions.SenderEmail;
        });

        return builder;
    }
}
