namespace CoffeeTracker.K_MYR.Server.Domain.Entities;

internal class CoffeeRecord
{
    public int Id { get; set; }
    public DateTime DateTime { get; set; }
    public required string Type { get; set; }
}
