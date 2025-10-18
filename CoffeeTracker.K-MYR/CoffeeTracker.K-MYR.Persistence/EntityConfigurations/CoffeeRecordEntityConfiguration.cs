using CoffeeTracker.K_MYR.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CoffeeTracker.K_MYR.Persistence.EntityConfigurations;

internal sealed class CoffeeRecordEntityConfiguration : IEntityTypeConfiguration<CoffeeRecordEntity>
{
    public void Configure(EntityTypeBuilder<CoffeeRecordEntity> builder)
    {
        builder
            .HasIndex(c => new { c.UserId, c.DateTime, c.Id });

        builder
            .Property(e => e.DateTime)
            .HasConversion(
                v => DateTime.SpecifyKind(v, DateTimeKind.Utc),
                v => v
            );

        builder
            .HasGeneratedTsVectorColumn(
                c => c.SearchVector,
                "english",
                c => new { c.Type })
            .HasIndex(c => c.SearchVector)
            .HasMethod("GIN");

        builder
            .HasOne(s => s.User)
            .WithMany(u => u.CoffeeRecords)
            .HasForeignKey(u => u.UserId)
            .IsRequired();
    }
}
