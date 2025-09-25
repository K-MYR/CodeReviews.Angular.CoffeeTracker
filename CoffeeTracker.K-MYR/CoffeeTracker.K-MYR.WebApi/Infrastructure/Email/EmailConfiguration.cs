using System.ComponentModel.DataAnnotations;

namespace CoffeeTracker.K_MYR.WebApi.Infrastructure.Email;

public class EmailConfiguration
{
    public const string Key = "EmailConfiguration";
    [Required(ErrorMessage = "Sender email required")]
    public required string SenderEmail { get; set; }
    [Required(ErrorMessage = "Sender name required")]
    public required string SenderName { get; set; }
    public required string SmtpServer { get; set; }
    public int SmtpPort { get; set; }
    public string? UserName { get; set; }
    public string? Password { get; set; }
}
