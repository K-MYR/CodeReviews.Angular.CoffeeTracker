using CoffeeTracker.K_MYR.Server.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CoffeeTracker.K_MYR.Server.Persistence.DatabaseContext;

public sealed class CoffeeRecordContext(DbContextOptions<CoffeeRecordContext> options) : DbContext(options)
{
    public required DbSet<CoffeeRecord> CoffeeRecords { get; set; }
}
