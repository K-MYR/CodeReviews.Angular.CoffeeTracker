using CoffeeTracker.K_MYR.Server.Application.DTOs;
using CoffeeTracker.K_MYR.Server.Application.Interfaces;
using CoffeeTracker.K_MYR.Server.Domain.Entities;
using CoffeeTracker.K_MYR.Server.Persistence.DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace CoffeeTracker.K_MYR.Server.Persistence.Repositories;

internal sealed class CoffeeRecordRepository(DatabaseContext.CoffeeRecordContext context) : ICoffeeRecordRepository
{
    private readonly DatabaseContext.CoffeeRecordContext _context = context;    

    public ValueTask<CoffeeRecord?> GetAsync(int id, CancellationToken ct)
    {
        return _context.CoffeeRecords.FindAsync([id, ct], cancellationToken: ct);
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
        CancellationToken ct,
        Func<IQueryable<CoffeeRecord>, IQueryable<CoffeeRecord>>? filter = null)
    {
        IQueryable<CoffeeRecord> query = _context.CoffeeRecords;

        if(filter is not null)
        {
            query = filter(query);
        }

        if(startDate is not null)
        {
            query = query.Where(c => c.DateTime >= startDate);
        }

        if (endDate is not null)
        {
            query = query.Where(c => c.DateTime <= endDate);
        }

        if(type is not null)
        {
            query = query.Where(c => c.Type.Contains(type));
        }

        query = orderBy(query);

        return  query.Take(pageSize)                      
                     .AsNoTracking()
                     .ToListAsync(ct);
    }
    
    public Task<List<TypeStatisticsDTO>> GetStatistics(DateTime today, CancellationToken ct)
    {
        var todayStart = new DateTime(today.Year, today.Month, today.Day);
        var todayEnd = todayStart.AddDays(1);
        var firstDayOfTheWeek = today.AddDays(-(int)today.DayOfWeek);
        var weekStart = new DateTime(firstDayOfTheWeek.Year, firstDayOfTheWeek.Month, firstDayOfTheWeek.Day);
        var weekEnd = weekStart.AddDays(7);
        var monthStart = new DateTime(today.Year, today.Month, 1);
        var monthEnd = monthStart.AddMonths(1);
        var yearStart = new DateTime(today.Year, 1, 1);
        var yearEnd = yearStart.AddYears(1);

        return _context.CoffeeRecords
            .Where(c => c.DateTime > yearStart && c.DateTime < yearEnd)
            .GroupBy(c => c.Type)
            .Select(g => new TypeStatisticsDTO()
            {
                CoffeeType = g.Key,
                YearCount = g.Count(),
                MonthCount = g.Count(c => c.DateTime > monthStart && c.DateTime < monthEnd),
                WeekCount = g.Count(c => c.DateTime > weekStart && c.DateTime < weekEnd),
                DayCount = g.Count(c => c.DateTime > todayStart && c.DateTime < todayEnd)
            })   
            .OrderBy(t => t.CoffeeType)
            .AsNoTracking()
            .ToListAsync(ct); ;
        
    }
  
}
