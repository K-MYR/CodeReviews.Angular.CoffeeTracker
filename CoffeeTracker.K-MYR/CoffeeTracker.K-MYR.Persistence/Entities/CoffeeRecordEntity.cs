using CoffeeTracker.K_MYR.Domain.Entities;
using NpgsqlTypes;

namespace CoffeeTracker.K_MYR.Persistence.Entities;

public sealed class CoffeeRecordEntity
{
    public int Id { get; set; }
    public required DateTime DateTime { get; set; }
    public required string Type { get; set; }
    public required Guid UserId { get; set; }
    public AppUser? User { get; set; }
    internal CoffeeRecord ToDomain() => new()
    {
        Id = Id,
        DateTime = DateTime,
        Type = Type,
        UserId = UserId,
    };
    internal static CoffeeRecordEntity FromDomain(CoffeeRecord coffeeRecord) => new()
    {
        Id = coffeeRecord.Id,
        DateTime = coffeeRecord.DateTime,
        Type = coffeeRecord.Type,
        UserId = coffeeRecord.UserId,
    };
}
