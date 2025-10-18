using CoffeeTracker.K_MYR.Domain.Entities;
using CoffeeTracker.K_MYR.Application.DTOs;
using CoffeeTracker.K_MYR.Common.Enums;
using CoffeeTracker.K_MYR.Application.Enums;

namespace CoffeeTracker.K_MYR.Application.Interfaces;

public interface ICoffeeRecordRepository
{
    Task<List<CoffeeRecord>> GetAllAsync(
        Guid userId,
        CoffeeRecordOrderBy orderBy,
        CancellationToken ct,
        bool isPrevious = false,
        int pageSize = 10,
        OrderDirection orderDirection = OrderDirection.Ascending,
        DateTime? startDate = null,
        DateTime? endDate = null,
        string? type = null,
        int? lastId = null,
        object? lastValue = null);
    Task<CoffeeRecord?> GetAsync(Guid userId, int id, CancellationToken ct);
    Task CreateAsync(CoffeeRecord coffeeRecord, CancellationToken ct);
    Task UpdateAsync(CoffeeRecord record, CancellationToken ct);
    Task DeleteAsync(CoffeeRecord record, CancellationToken ct);
    Task<List<TypeStatisticsDTO>> GetStatistics(Guid userId, DateTime dateTime, CancellationToken ct);    
}
