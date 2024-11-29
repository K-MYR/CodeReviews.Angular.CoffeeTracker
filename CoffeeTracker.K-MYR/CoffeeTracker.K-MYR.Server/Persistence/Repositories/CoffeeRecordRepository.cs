using CoffeeTracker.K_MYR.Server.Application.Interfaces;
using CoffeeTracker.K_MYR.Server.Domain.Entities;
using CoffeeTracker.K_MYR.Server.Persistence.DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace CoffeeTracker.K_MYR.Server.Persistence.Repositories;

public sealed class CoffeeRecordRepository(CoffeeRecordContext context) : ICoffeeRecordRepository
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

    public Task<List<CoffeeRecord>> GetAllAsync(DateOnly date, CancellationToken ct)
    {
        var startDate = new DateTime(date.Year, date.Month, date.Day);
        var endDate = startDate.AddDays(1);

        return _context.CoffeeRecords
                       .Where(cr => cr.DateTime >= startDate && cr.DateTime < endDate)
                       .AsNoTracking()
                       .ToListAsync(ct);
    }
}
