using System.ComponentModel.DataAnnotations;

namespace CoffeeTracker.K_MYR.Server.Infrastructure.Spa;

public class SpaConfiguration
{
    public const string Key = "SpaConfiguration";
    [Required(ErrorMessage = "Uri for confirm email page missing")]
    public required string ConfirmEmailUri { get; init; }
    [Required(ErrorMessage = "Uri for reset password page missing")]
    public required string ResetPasswordUri { get; init; }
  
}
