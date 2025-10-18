using CoffeeTracker.K_MYR.Application.DTOs;
using CoffeeTracker.K_MYR.Application.Enums;
using CoffeeTracker.K_MYR.Application.Interfaces;
using CoffeeTracker.K_MYR.Common.Enums;
using CoffeeTracker.K_MYR.Domain.Entities;
using CoffeeTracker.K_MYR.Persistence.DatabaseContexts;
using CoffeeTracker.K_MYR.Persistence.Entities;
using CoffeeTracker.K_MYR.Shared;
using LanguageExt;
using Microsoft.EntityFrameworkCore;

namespace CoffeeTracker.K_MYR.Persistence.Repositories;

public sealed class CoffeeRecordRepository(CoffeeRecordContext context) : ICoffeeRecordRepository
{
    private readonly CoffeeRecordContext _context = context;

    public Task<CoffeeRecord?> GetAsync(Guid userId, int id, CancellationToken ct)
    {
        return _context.CoffeeRecords
            .Select(c => c.ToDomain())
            .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId, ct);
    }

    public Task CreateAsync(CoffeeRecord coffeeRecord, CancellationToken ct)
    {
        _context.Add(coffeeRecord);
        return _context.SaveChangesAsync(ct);
    }

    public Task UpdateAsync(CoffeeRecord record, CancellationToken ct)
    {
        _context.Update(record);
        return _context.SaveChangesAsync(ct);
    }

    public Task DeleteAsync(CoffeeRecord record, CancellationToken ct)
    {
        _context.Remove(record);
        return _context.SaveChangesAsync(ct);
    }

    public Task<List<CoffeeRecord>> GetAllAsync(
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
        object? lastValue = null      
        )
    {
        var isAscendingOrder = orderDirection == OrderDirection.Ascending ^ isPrevious;
        IQueryable<CoffeeRecordEntity> query = _context.CoffeeRecords.Where(c => c.UserId == userId);

        query = ApplyPagination(query, orderBy, lastId, lastValue, isAscendingOrder);

        if (startDate is not null)
        {
            query = query.Where(c => c.DateTime >= startDate);
        }

        if (endDate is not null)
        {
            query = query.Where(c => c.DateTime <= endDate);
        }

        if (!string.IsNullOrEmpty(type))
        {
            query = query.Where(c => c.SearchVector.Matches(EF.Functions.PhraseToTsQuery("english", type))
            );
        }

        query = ApplyOrdering(query, orderBy, isAscendingOrder);

        return query
            .Select(c => c.ToDomain())
            .Take(pageSize + 1)
            .AsNoTracking()
            .ToListAsync(ct);
    }

    public Task<List<TypeStatisticsDTO>> GetStatistics(Guid userId, DateTime dateTime, CancellationToken ct)
    {
        IQueryable<CoffeeRecordEntity> query = _context.CoffeeRecords.Where(c => c.UserId == userId);
        dateTime = DateTime.SpecifyKind(dateTime, DateTimeKind.Utc); 
        var todayStart = new DateTime(dateTime.Year, dateTime.Month, dateTime.Day);
        var todayEnd = todayStart.AddDays(1);
        var elapsedDaysOfWeek = dateTime.ElapsedDaysOfWeek(DayOfWeek.Monday);
        var firstDayOfTheWeek = TimeSpan.TicksPerDay * elapsedDaysOfWeek <= dateTime.Ticks
            ? dateTime.AddDays(-elapsedDaysOfWeek)
            : DateTime.MinValue;
        var weekStart = new DateTime(firstDayOfTheWeek.Year, firstDayOfTheWeek.Month, firstDayOfTheWeek.Day);
        var weekEnd = weekStart.AddDays(7);
        var monthStart = new DateTime(dateTime.Year, dateTime.Month, 1);
        var monthEnd = monthStart.AddMonths(1);
        var yearStart = new DateTime(dateTime.Year, 1, 1);
        var yearEnd = yearStart.AddYears(1);

        return query
            .Where(r => r.UserId == userId)
            .GroupBy(c => c.Type)
            .Select(g => new TypeStatisticsDTO()
            {
                CoffeeType = g.Key,
                AllTime = g.Count(),
                YearCount = g.Count(c => c.DateTime >= yearStart && c.DateTime < yearEnd),
                MonthCount = g.Count(c => c.DateTime >= monthStart && c.DateTime < monthEnd),
                WeekCount = g.Count(c => c.DateTime >= weekStart && c.DateTime < weekEnd),
                DayCount = g.Count(c => c.DateTime >= todayStart && c.DateTime < todayEnd)
            })
            .OrderBy(t => t.CoffeeType)
            .AsNoTracking()
            .ToListAsync(ct);
    }

    private static IQueryable<CoffeeRecordEntity> ApplyPagination(
    IQueryable<CoffeeRecordEntity> query,
    CoffeeRecordOrderBy orderBy,
    int? lastId = null,
    object? lastValue = null,
    bool isAscending = true)
    {         
        if (orderBy == CoffeeRecordOrderBy.Id
            && lastId is not null)
        {
            query = isAscending
                ? query.Where(c => c.Id > lastId)
                : query.Where(c => c.Id < lastId);
        }
        else if (lastValue is not null && lastId is not null)
        {
            query =  orderBy switch
            {
                CoffeeRecordOrderBy.Type => isAscending
                    ? query.Where(c => EF.Functions.GreaterThan(
                        ValueTuple.Create(c.Type, c.Id),
                        ValueTuple.Create(lastValue, lastId)))
                    : query.Where(c => EF.Functions.LessThan(
                        ValueTuple.Create(c.Type, c.Id),
                        ValueTuple.Create(lastValue, lastId))),
                CoffeeRecordOrderBy.DateTime => isAscending
                    ? query.Where(c => EF.Functions.GreaterThan(
                        ValueTuple.Create(c.DateTime, c.Id),
                        ValueTuple.Create(lastValue, lastId)))
                    : query.Where(c => EF.Functions.LessThan(
                        ValueTuple.Create(c.DateTime, c.Id),
                        ValueTuple.Create(lastValue, lastId))),
                _ => query
            };
        }
        return query;
        }

    private static IQueryable<CoffeeRecordEntity> ApplyOrdering(
        IQueryable<CoffeeRecordEntity> query,
        CoffeeRecordOrderBy orderBy,
        bool isAscending)
    {
        return orderBy switch
        {
            CoffeeRecordOrderBy.Type => isAscending
                ? query.OrderBy(c => c.Type).ThenBy(c => c.Id)
                : query.OrderByDescending(c => c.Type).ThenByDescending(c => c.Id),
            CoffeeRecordOrderBy.DateTime => isAscending
                ? query.OrderBy(c => c.DateTime).ThenBy(c => c.Id)
                : query.OrderByDescending(c => c.DateTime).ThenByDescending(c => c.Id),
            _ => isAscending
                ? query.OrderBy(c => c.Id)
                : query.OrderByDescending(c => c.Id)
        };
    }
}
