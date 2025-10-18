using CoffeeTracker.K_MYR.Application.DTOs;
using CoffeeTracker.K_MYR.Application.Enums;
using CoffeeTracker.K_MYR.Application.Interfaces;
using CoffeeTracker.K_MYR.Common;
using CoffeeTracker.K_MYR.Common.Enums;
using CoffeeTracker.K_MYR.Domain.Entities;
using LanguageExt.Common;
using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace CoffeeTracker.K_MYR.Application.Services;

public interface ICoffeeRecordService
{
    Task<CoffeeRecord?> GetCoffeeRecordAsync(int id, Guid userId, CancellationToken ct);
    Task<Result<PaginatedList<CoffeeRecord>>> GetCoffeeRecordsAsync(
        Guid userId,
        DateTime? dateTimeFrom = null,
        DateTime? dateTimeTo = null,
        string? type = null,
        CoffeeRecordOrderBy orderBy = CoffeeRecordOrderBy.Id,
        int? lastId = null,
        string? lastValue = null,
        int pageSize = 10,
        bool isPrevious = false,
        OrderDirection orderDirection = OrderDirection.Ascending,
        CancellationToken ct = default
    );
    Task CreateCoffeeRecordAsync(CoffeeRecord record, CancellationToken ct);
    Task UpdateCoffeeRecordAsync(CoffeeRecord record, CancellationToken ct);
    Task DeleteCoffeeRecordAsync(CoffeeRecord record, CancellationToken ct);
    Task<List<TypeStatisticsDTO>> GetStatistics(DateTime today, Guid userId, CancellationToken ct);
}

public sealed class CoffeeRecordService(ICoffeeRecordRepository coffeeRecordRepository) : ICoffeeRecordService
{
    private readonly ICoffeeRecordRepository _coffeeRecordRepository = coffeeRecordRepository;
    private static readonly Dictionary<CoffeeRecordOrderBy, PropertyInfo> _orderByMap =
    new()
    {
        [CoffeeRecordOrderBy.Type] = typeof(CoffeeRecord).GetProperty(nameof(CoffeeRecord.Type))!,
        [CoffeeRecordOrderBy.DateTime] = typeof(CoffeeRecord).GetProperty(nameof(CoffeeRecord.DateTime))!,
        [CoffeeRecordOrderBy.Id] = typeof(CoffeeRecord).GetProperty(nameof(CoffeeRecord.Id))!,
    };

    public Task<CoffeeRecord?> GetCoffeeRecordAsync(int id, Guid userId, CancellationToken ct)
    {
        return _coffeeRecordRepository.GetAsync(userId, id, ct);
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

    public Task<List<TypeStatisticsDTO>> GetStatistics(DateTime today, Guid userId, CancellationToken ct)
    {
        return _coffeeRecordRepository.GetStatistics(userId, today, ct);
    }

    public async Task<Result<PaginatedList<CoffeeRecord>>> GetCoffeeRecordsAsync(
        Guid userId,
        DateTime? dateTimeFrom = null,
        DateTime? dateTimeTo = null,
        string? type = null,
        CoffeeRecordOrderBy orderBy = CoffeeRecordOrderBy.Id,
        int? lastId = null,
        string? lastValue = null,
        int pageSize = 10,
        bool isPrevious = false,
        OrderDirection orderDirection = OrderDirection.Ascending,
        CancellationToken ct = default)
    {
        object? convertedValue = null;
        var coffeeRecordOrderBy = CoffeeRecordOrderBy.Id;
        if (!_orderByMap.TryGetValue(coffeeRecordOrderBy, out PropertyInfo? property))
        {
            return new Result<PaginatedList<CoffeeRecord>>(new ValidationException($"'{orderBy}' is not a valid field for ordering."));
        }         

        if (property is not null
            && lastValue is not null
            && !TryStringToType(lastValue, property.PropertyType, out convertedValue))
        {
            return new Result<PaginatedList<CoffeeRecord>>(new ValidationException($"Failed to convert '{lastValue}' to the expected type."));
        }        

        var coffeeRecords = await _coffeeRecordRepository.GetAllAsync(
            userId, orderBy, ct, isPrevious, pageSize, orderDirection, dateTimeFrom, dateTimeTo, type?.Trim(), lastId, convertedValue);
        var hasNext = coffeeRecords.Count > pageSize;
        var hasPrevious = lastId is not null;

        if (hasNext)
        {
            coffeeRecords.RemoveAt(coffeeRecords.Count - 1);
        }

        if (isPrevious)
        {
            (hasNext, hasPrevious) = (hasPrevious, hasNext);
            coffeeRecords.Reverse();
        }

        var paginatedList = new PaginatedList<CoffeeRecord>(
            coffeeRecords,
            hasNext,
            hasPrevious,
            isPrevious,
            orderBy.ToString(),
            orderDirection
        );

        return paginatedList;
    }  

    private static bool TryStringToType(string value, Type type, out object? lastValue)
    {       
        try
        {
            lastValue = Convert.ChangeType(value, type);
            return true;
        }
        catch
        {
            lastValue = default;
            return false;
        }
    }
}
