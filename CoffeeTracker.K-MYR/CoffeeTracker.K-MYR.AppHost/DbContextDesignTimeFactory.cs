using CoffeeTracker.K_MYR.Persistence.DatabaseContexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
namespace CoffeeTracker.K_MYR.AppHost;

public sealed class DataContextDesignTimeFactory :
    IDesignTimeDbContextFactory<CoffeeRecordContext>
{
    public CoffeeRecordContext CreateDbContext(string[] args)
    {
        var builder = DistributedApplication.CreateBuilder(args);
        var optionsBuilder = new DbContextOptionsBuilder<CoffeeRecordContext>();
        optionsBuilder.UseNpgsql();
        return new CoffeeRecordContext(optionsBuilder.Options);
    }
}