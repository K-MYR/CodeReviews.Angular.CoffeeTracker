using CoffeeTracker.K_MYR.Server.Application.Interfaces;
using CoffeeTracker.K_MYR.Server.Domain.Entities;
using CoffeeTracker.K_MYR.Server.Endpoints;
using CoffeeTracker.K_MYR.Server.Shared;
using System.ComponentModel.DataAnnotations;
using LanguageExt.Common;
using CoffeeTracker.K_MYR.Server.Shared.Enums;
using System.Linq.Dynamic.Core;
using CoffeeTracker.K_MYR.Server.Application.DTOs;

namespace CoffeeTracker.K_MYR.Server.Application.Services;

internal interface ICoffeeRecordService
{
   Task<CoffeeRecord?> GetCoffeeRecordAsync(int id, Guid userId, CancellationToken ct);
    Task<Result<PaginatedList<CoffeeRecord>>> GetCoffeeRecordsAsync(GetCoffeeRecordsRequest request, Guid userId, CancellationToken ct);
    Task CreateCoffeeRecordAsync(CoffeeRecord record, CancellationToken ct);
    Task UpdateCoffeeRecordAsync(CoffeeRecord record, CancellationToken ct);
    Task DeleteCoffeeRecordAsync(CoffeeRecord record, CancellationToken ct);
    Task<List<TypeStatisticsDTO>> GetStatistics(DateTime today, Guid userId, CancellationToken ct);
}

internal sealed class CoffeeRecordService(ICoffeeRecordRepository coffeeRecordRepository) : ICoffeeRecordService
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

    public async Task<Result<PaginatedList<CoffeeRecord>>> GetCoffeeRecordsAsync(GetCoffeeRecordsRequest request, Guid userId, CancellationToken ct)
    {
        Func<IQueryable<CoffeeRecord>, IOrderedQueryable<CoffeeRecord>> orderBy = q => q.OrderBy(t => t.Id);
        Func<IQueryable<CoffeeRecord>, IQueryable<CoffeeRecord>>? filter = null;

        if (request.OrderBy is not null)
        {
            if (!OrderingHelpers.IsAllowedProperty(request.OrderBy))
            {
                return new Result<PaginatedList<CoffeeRecord>>(new ValidationException($"'{request.OrderBy}' is not a valid field for ordering."));
            }

            bool IsAscendingOrder = (request.OrderDirection == OrderDirection.Ascending) ^ request.IsPrevious;
            string orderDirection = IsAscendingOrder ? "" : " DESC";
            string orderString = $"{request.OrderBy}{orderDirection}, Id{orderDirection}";
            orderBy = q => q.OrderBy(orderString);

            if (request.LastId is not null)
            {
                string comparerSymbol = IsAscendingOrder ? ">" : "<";

                if (request.OrderBy != nameof(CoffeeRecord.Id) && request.LastValue is not null)
                {
                    var type = OrderingHelpers.GetProperty<CoffeeRecord>(request.OrderBy)?.PropertyType;

                    if (type is null)
                    {
                        return new Result<PaginatedList<CoffeeRecord>>(new ValidationException($"Failed to retrieve the type for the property '{request.OrderBy}'."));
                    }

                    try
                    {
                        var lastValue = Convert.ChangeType(request.LastValue, type);
                        filter = q => q.Where($"{request.OrderBy} {comparerSymbol} @0 || ({request.OrderBy} == @0 && Id {comparerSymbol} @1)", lastValue, request.LastId);
                    }
                    catch
                    {
                        return new Result<PaginatedList<CoffeeRecord>>(new ValidationException($"Failed to convert '{request.LastValue}' to the expected type '{type.Name}'."));
                    }
                }
                else
                {
                    filter = q => q.Where($"Id {comparerSymbol} @0", request.LastId);
                }
            }
        }     
        var coffeeRecords = await _coffeeRecordRepository.GetAllAsync(request.DateTimeFrom, request.DateTimeTo, request.Type, request.PageSize + 1, orderBy, userId, ct, filter);
        var hasNext = coffeeRecords.Count > request.PageSize;
        var hasPrevious = request.LastId is not null;
        var isPrevious = request.IsPrevious;

        if (hasNext)
        {
            coffeeRecords.RemoveAt(coffeeRecords.Count - 1);
        }

        if (request.IsPrevious)
        {
            (hasNext, hasPrevious) = (hasPrevious, hasNext);
            coffeeRecords.Reverse();
        }

        var paginatedList = new PaginatedList<CoffeeRecord>(
            coffeeRecords, 
            hasNext, 
            hasPrevious,
            isPrevious,
            request.OrderBy ?? "Id", 
            request.OrderDirection
        );

        return paginatedList;
    }
}
