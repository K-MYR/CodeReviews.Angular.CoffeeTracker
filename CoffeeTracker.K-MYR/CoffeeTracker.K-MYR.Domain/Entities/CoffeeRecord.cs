namespace CoffeeTracker.K_MYR.Domain.Entities;

public class CoffeeRecord
{
    public int Id { get; set; }
    public required DateTime DateTime { get; set; }
    public required string Type { get; set; }
    public required Guid UserId { get; set; }
}
