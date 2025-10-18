using CoffeeTracker.K_MYR.Persistence.Entities;
using CoffeeTracker.K_MYR.Persistence.EntityConfigurations;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CoffeeTracker.K_MYR.Persistence.DatabaseContexts;

public sealed class CoffeeRecordContext(DbContextOptions<CoffeeRecordContext> options) : IdentityDbContext<AppUser, AppRole, Guid>(options)
{
    public DbSet<CoffeeRecordEntity> CoffeeRecords { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        new CoffeeRecordEntityConfiguration()
            .Configure(modelBuilder.Entity<CoffeeRecordEntity>());
    }
}
