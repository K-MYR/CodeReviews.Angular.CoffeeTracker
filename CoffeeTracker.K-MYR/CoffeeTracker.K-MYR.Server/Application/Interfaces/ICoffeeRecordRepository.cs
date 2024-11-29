using CoffeeTracker.K_MYR.Server.Domain.Entities;

namespace CoffeeTracker.K_MYR.Server.Application.Interfaces;

public interface ICoffeeRecordRepository
{
    Task<List<CoffeeRecord>> GetAllAsync(DateOnly date, CancellationToken ct);
    ValueTask<CoffeeRecord?> GetAsync(int id, CancellationToken ct);
    Task CreateAsync(CoffeeRecord coffeeRecord, CancellationToken ct);
    Task UpdateAsync(CoffeeRecord record, CancellationToken ct);
    Task DeleteAsync(CoffeeRecord record, CancellationToken ct);

}
