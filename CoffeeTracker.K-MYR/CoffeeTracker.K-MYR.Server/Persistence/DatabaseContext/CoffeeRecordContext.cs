using CoffeeTracker.K_MYR.Server.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CoffeeTracker.K_MYR.Server.Persistence.DatabaseContext;

internal sealed class CoffeeRecordContext(DbContextOptions<CoffeeRecordContext> options) : IdentityDbContext(options)
{
    internal required DbSet<CoffeeRecord> CoffeeRecords { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder
            .Entity<CoffeeRecord>()
            .HasIndex(c => c.DateTime);            
    }
}
