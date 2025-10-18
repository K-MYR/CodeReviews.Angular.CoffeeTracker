namespace CoffeeTracker.K_MYR.WebApi.Infrastructure.ClientApp;

public class ClientAppConfigurationSettings
{
    public const string Key = "SpaConfiguration";
    public string? Uri { get; init; }
    public required string ConfirmEmailEndpoint { get; init; }
    public required string ResetPasswordEndpoint { get; init; }
  
}

public class ClientAppConfiguration
{
    public required Uri ConfirmEmailEndpoint { get; set; }
    public required Uri ResetPasswordEndpoint { get; set; }
}
