using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace CoffeeTracker.K_MYR.Common;

public static class WebApplicationExtensions
{
    public static async Task ConfigureDatabaseAsync<T>(this WebApplication app) where T : DbContext
    {
        using var scope = app.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<T>();

        await EnsureDatabaseAsnyc(dbContext);
        await RunMigrationsAsync(dbContext);
    }   

    private static async Task EnsureDatabaseAsnyc<T>(T dbcontext) where T : DbContext
    {
        var dbCreator = dbcontext.GetService<IRelationalDatabaseCreator>();

        if (!await dbCreator.ExistsAsync())
        {
            await dbCreator.CreateAsync();
        }
    }

    private static async Task RunMigrationsAsync<T>(T dbcontext) where T : DbContext
    {       
        await dbcontext.Database.MigrateAsync();       
    }
}

