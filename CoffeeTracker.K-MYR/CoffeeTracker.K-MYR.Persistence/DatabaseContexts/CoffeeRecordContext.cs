using CoffeeTracker.K_MYR.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CoffeeTracker.K_MYR.Persistence.DatabaseContexts;

public sealed class CoffeeRecordContext(DbContextOptions<CoffeeRecordContext> options) : IdentityDbContext<AppUser, AppRole, Guid>(options)
{
    public DbSet<CoffeeRecord> CoffeeRecords { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder
            .Entity<CoffeeRecord>()
            .HasIndex(c => c.DateTime);

        modelBuilder.Entity<CoffeeRecord>()
        .Property(e => e.DateTime)
        .HasConversion(
            v => DateTime.SpecifyKind(v, DateTimeKind.Utc),
            v => v
        );

        modelBuilder
            .Entity<CoffeeRecord>()
            .HasIndex(c => c.Type)
            .HasMethod("GIN")
            .IsTsVectorExpressionIndex("english");
       
        modelBuilder
            .Entity<CoffeeRecord>()
            .HasOne(s => s.User)
            .WithMany(u => u.CoffeeRecords)
            .HasForeignKey(u => u.UserId)
            .IsRequired();

    }
}
