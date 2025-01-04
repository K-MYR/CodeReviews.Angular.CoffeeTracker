using CoffeeTracker.K_MYR.Server.Application.Interfaces;
using CoffeeTracker.K_MYR.Server.Domain.Entities;
using CoffeeTracker.K_MYR.Server.Persistence.DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace CoffeeTracker.K_MYR.Server.Persistence.Repositories;

internal sealed class CoffeeRecordRepository(CoffeeRecordContext context) : ICoffeeRecordRepository
{
    private readonly CoffeeRecordContext _context = context;    

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
}
