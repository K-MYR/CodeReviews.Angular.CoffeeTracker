using CoffeeTracker.K_MYR.Server.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CoffeeTracker.K_MYR.Server.Persistence.DatabaseContext;

internal sealed class CoffeeRecordContext(DbContextOptions<CoffeeRecordContext> options) : DbContext(options)
{
    internal required DbSet<CoffeeRecord> CoffeeRecords { get; set; }
}
