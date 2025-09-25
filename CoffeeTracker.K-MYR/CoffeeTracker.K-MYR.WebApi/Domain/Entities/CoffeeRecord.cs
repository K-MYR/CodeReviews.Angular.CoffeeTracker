namespace CoffeeTracker.K_MYR.WebApi.Domain.Entities;

internal class CoffeeRecord
{
    public int Id { get; set; }
    public required DateTime DateTime { get; set; }
    public required string Type { get; set; }
    public required Guid UserId { get; set; }
    public AppUser? User { get; set; }
}
