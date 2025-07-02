namespace CoffeeTracker.K_MYR.Server.Infrastructure.Email;

public class EmailConfiguration
{
    public const string EmailConfig = "EmailConfiguration";
    public required string SenderEmail { get; set; }
    public required string SenderName { get; set; }
    public required string SmtpServer { get; set; }
    public int SmtpPort { get; set; }
    public string? UserName { get; set; }
    public string? Password { get; set; }
}
