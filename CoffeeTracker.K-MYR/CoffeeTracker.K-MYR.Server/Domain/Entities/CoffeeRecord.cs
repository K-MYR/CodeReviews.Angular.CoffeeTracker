namespace CoffeeTracker.K_MYR.Server.Domain.Entities;

public class CoffeeRecord
{
    public int Id { get; set; }
    public DateTime DateTime { get; set; }
    public required string Type { get; set; }
}
