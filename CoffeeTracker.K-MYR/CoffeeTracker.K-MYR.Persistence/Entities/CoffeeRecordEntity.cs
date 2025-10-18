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
    public NpgsqlTsVector SearchVector { get; init; } = NpgsqlTsVector.Empty;
    internal CoffeeRecord ToDomain() => new()
    {
        Id = Id,
        DateTime = DateTime,
        Type = Type.Trim(),
        UserId = UserId,
    };
}
