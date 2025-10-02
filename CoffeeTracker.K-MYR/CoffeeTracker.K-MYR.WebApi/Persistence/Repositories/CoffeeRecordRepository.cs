using CoffeeTracker.K_MYR.WebApi.Application.DTOs;
using CoffeeTracker.K_MYR.WebApi.Application.Interfaces;
using CoffeeTracker.K_MYR.WebApi.Domain.Entities;
using CoffeeTracker.K_MYR.WebApi.Persistence.DatabaseContext;
using CoffeeTracker.K_MYR.WebApi.Shared;
using Microsoft.EntityFrameworkCore;

namespace CoffeeTracker.K_MYR.WebApi.Persistence.Repositories;

internal sealed class CoffeeRecordRepository(CoffeeRecordContext context) : ICoffeeRecordRepository
{
    private readonly CoffeeRecordContext _context = context;

    public Task<CoffeeRecord?> GetAsync(int id, Guid userId, CancellationToken ct)
    {
        return _context.CoffeeRecords.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId, ct);
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
        DateTime? startDate, DateTime? endDate, string? type, int pageSize,
        Func<IQueryable<CoffeeRecord>, IOrderedQueryable<CoffeeRecord>> orderBy,
        Guid userId, CancellationToken ct,
        Func<IQueryable<CoffeeRecord>, IQueryable<CoffeeRecord>>? filter = null)
    {
        IQueryable<CoffeeRecord> query = _context.CoffeeRecords.Where(c => c.UserId == userId);

        if (filter is not null)
        {
            query = filter(query);
        }

        if (startDate is not null)
        {
            query = query.Where(c => c.DateTime >= startDate);
        }

        if (endDate is not null)
        {
            query = query.Where(c => c.DateTime <= endDate);
        }

        if (type is not null)
        {
            query = query.Where(c => c.Type.Contains(type));
        }

        query = orderBy(query);

        return query.Take(pageSize)
                     .AsNoTracking()
                     .ToListAsync(ct);
    }

    public Task<List<TypeStatisticsDTO>> GetStatistics(DateTime dateTime, Guid userId, CancellationToken ct)
    {
        IQueryable<CoffeeRecord> query = _context.CoffeeRecords.Where(c => c.UserId == userId);

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
            .ToListAsync(ct); ;

    }

}
