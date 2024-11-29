using CoffeeTracker.K_MYR.Server.Application.Interfaces;
using CoffeeTracker.K_MYR.Server.Domain.Entities;

namespace CoffeeTracker.K_MYR.Server.Application.Services;

public interface ICoffeeRecordService
{
    ValueTask<CoffeeRecord?> GetCoffeeRecordAsync(int id, CancellationToken ct);
    Task<List<CoffeeRecord>> GetCoffeeRecordsAsync(DateOnly date, CancellationToken ct);
    Task CreateCoffeeRecordAsync(CoffeeRecord record, CancellationToken ct);
    Task UpdateCoffeeRecordAsync(CoffeeRecord record, CancellationToken ct);
    Task DeleteCoffeeRecordAsync(CoffeeRecord record, CancellationToken ct);
}

public sealed class CoffeeRecordService(ICoffeeRecordRepository coffeeRecordRepository) : ICoffeeRecordService
{
    private readonly ICoffeeRecordRepository _coffeeRecordRepository = coffeeRecordRepository;    

    public ValueTask<CoffeeRecord?> GetCoffeeRecordAsync(int id, CancellationToken ct)
    {
        return _coffeeRecordRepository.GetAsync(id, ct);
    }

    public Task CreateCoffeeRecordAsync(CoffeeRecord record, CancellationToken ct)
    {
        return _coffeeRecordRepository.CreateAsync(record, ct);
    }

    public Task UpdateCoffeeRecordAsync(CoffeeRecord record, CancellationToken ct)
    {
        return _coffeeRecordRepository.UpdateAsync(record, ct);
    }

    public Task DeleteCoffeeRecordAsync(CoffeeRecord record, CancellationToken ct)
    {
        return _coffeeRecordRepository.DeleteAsync(record, ct);
    }

    public Task<List<CoffeeRecord>> GetCoffeeRecordsAsync(DateOnly date, CancellationToken ct)
    {
        return _coffeeRecordRepository.GetAllAsync(date, ct);
    }
}
