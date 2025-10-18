using CoffeeTracker.K_MYR.Domain.Entities;
using CoffeeTracker.K_MYR.Application.DTOs;

namespace CoffeeTracker.K_MYR.Application.Interfaces;

public interface ICoffeeRecordRepository
{
    Task<List<CoffeeRecord>> GetAllAsync(
        DateTime? startDate, DateTime? endDate, string? type, int pageSize,
        Func<IQueryable<CoffeeRecord>, IOrderedQueryable<CoffeeRecord>> orderBy,
        Guid userId, CancellationToken ct, 
        Func<IQueryable<CoffeeRecord>, IQueryable<CoffeeRecord>>? filter = null);
    Task<CoffeeRecord?> GetAsync(int id, Guid userId, CancellationToken ct);
    Task CreateAsync(CoffeeRecord coffeeRecord, CancellationToken ct);
    Task UpdateAsync(CoffeeRecord record, CancellationToken ct);
    Task DeleteAsync(CoffeeRecord record, CancellationToken ct);
    Task<List<TypeStatisticsDTO>> GetStatistics(DateTime dateTime, Guid userId, CancellationToken ct);
}
