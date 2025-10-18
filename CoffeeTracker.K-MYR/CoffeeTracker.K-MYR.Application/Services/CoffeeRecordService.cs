using CoffeeTracker.K_MYR.Application.DTOs;
using CoffeeTracker.K_MYR.Application.Interfaces;
using CoffeeTracker.K_MYR.Common;
using CoffeeTracker.K_MYR.Common.Enums;
using CoffeeTracker.K_MYR.Domain.Entities;
using LanguageExt.Common;
using System.ComponentModel.DataAnnotations;
using System.Linq.Dynamic.Core;

namespace CoffeeTracker.K_MYR.Application.Services;

public interface ICoffeeRecordService
{
    Task<CoffeeRecord?> GetCoffeeRecordAsync(int id, Guid userId, CancellationToken ct);
    Task<Result<PaginatedList<CoffeeRecord>>> GetCoffeeRecordsAsync(
        Guid userId,
        DateTime? dateTimeFrom = null,
        DateTime? dateTimeTo = null,
        string? type = null,
        string? orderBy = null,
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

    public Task<CoffeeRecord?> GetCoffeeRecordAsync(int id, Guid userId, CancellationToken ct)
    {
        return _coffeeRecordRepository.GetAsync(id, userId, ct);
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
        return _coffeeRecordRepository.GetStatistics(today, userId, ct);
    }

    public async Task<Result<PaginatedList<CoffeeRecord>>> GetCoffeeRecordsAsync(
        Guid userId,
        DateTime? dateTimeFrom = null,
        DateTime? dateTimeTo = null,
        string? type = null,
        string? orderBy = null,
        int? lastId = null,
        string? lastValue = null,
        int pageSize = 10,
        bool isPrevious = false,
        OrderDirection orderDirection = OrderDirection.Ascending,
        CancellationToken ct = default
    )
    {
        Func<IQueryable<CoffeeRecord>, IOrderedQueryable<CoffeeRecord>> orderByFunc = q => q.OrderBy(t => t.Id);
        Func<IQueryable<CoffeeRecord>, IQueryable<CoffeeRecord>>? filterFunc = null;

        if (orderBy is not null)
        {
            if (!OrderingHelper.IsAllowedProperty(orderBy))
            {
                return new Result<PaginatedList<CoffeeRecord>>(new ValidationException($"'{orderBy}' is not a valid field for ordering."));
            }

            var IsAscendingOrder = orderDirection == OrderDirection.Ascending ^ isPrevious;
            var orderDirectionString = IsAscendingOrder ? "" : " DESC";
            var orderString = $"{orderBy}{orderDirectionString}, Id{orderDirectionString}";
            orderByFunc = q => q.OrderBy(orderString);

            if (lastId is not null)
            {
                char comparerSymbol = IsAscendingOrder ? '>' : '<';

                if (orderBy != nameof(CoffeeRecord.Id) && lastValue is not null)
                {
                    var propertyType = OrderingHelper.GetProperty<CoffeeRecord>(orderBy)?.PropertyType;

                    if (propertyType is null)
                    {
                        return new Result<PaginatedList<CoffeeRecord>>(new ValidationException($"Failed to retrieve the type for the property '{orderBy}'."));
                    }

                    try
                    {
                        var lastValueConverted = Convert.ChangeType(lastValue, propertyType);
                        filterFunc = q => q.Where($"{orderBy} {comparerSymbol} @0 || ({orderBy} == @0 && Id {comparerSymbol} @1)", lastValue, lastId);
                    }
                    catch
                    {
                        return new Result<PaginatedList<CoffeeRecord>>(new ValidationException($"Failed to convert '{lastValue}' to the expected type '{propertyType.Name}'."));
                    }
                }
                else
                {
                    filterFunc = q => q.Where($"Id {comparerSymbol} @0", lastId);
                }
            }
        }
        var coffeeRecords = await _coffeeRecordRepository.GetAllAsync(
            dateTimeFrom, dateTimeTo, type?.Trim(), pageSize + 1, orderByFunc, userId, ct, filterFunc);
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
            orderBy ?? "Id",
            orderDirection
        );

        return paginatedList;
    }
}
