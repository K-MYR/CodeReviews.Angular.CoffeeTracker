using CoffeeTracker.K_MYR.Persistence.DatabaseContexts;
using CoffeeTracker.K_MYR.Persistence.Entities;
using LanguageExt.Common;
using LanguageExt.Pretty;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
namespace CoffeeTracker.K_MYR.MigrationService;

public class Worker(
    IServiceScopeFactory scopeFactory,
    IHostApplicationLifetime hostApplicationLifetime) : BackgroundService
{
    public const string ActivitySourceName = "Migrations";
    private static readonly ActivitySource _activitySource = new(ActivitySourceName);
    private static readonly string[] _coffeeTypes = ["Espresso", "Latte", "Cappuccino", "Americano", "Mocha", "Flat White", "Latte Macchiato", "Macchiato", "Verlängerter", "Kleiner Brauner"];

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        using var activity = _activitySource.StartActivity("Migrating database", ActivityKind.Client);

        try
        {
            using var scope = scopeFactory.CreateScope();
            var sp = scope.ServiceProvider;
            var dbContext = sp.GetRequiredService<CoffeeRecordContext>();

            await RunMigrationAsync(dbContext, cancellationToken);
            await SeedDataAsync(sp, dbContext);
        }
        catch (Exception ex)
        {
            activity?.AddException(ex);
            throw;
        }

        hostApplicationLifetime.StopApplication();
    }

    private static async Task RunMigrationAsync(CoffeeRecordContext dbContext, CancellationToken ct)
    {        
        await dbContext.Database.MigrateAsync(ct);        
    }

    private static async Task SeedDataAsync(IServiceProvider sp, CoffeeRecordContext dbContext)
    {
        if (dbContext.CoffeeRecords.Any() || dbContext.Users.Any())
        {
            return;
        }
        
        var userManager = sp.GetRequiredService<UserManager<AppUser>>();
        var userStore = sp.GetRequiredService<IUserStore<AppUser>>(); 
        var emailStore = (IUserEmailStore<AppUser>)userStore;
        List<AppUser> users = [];
        for (int i = 1; i <= 20; i++)
        {
            AppUser user = new();
            var email = $"user{i}@test.com";
            await userManager.SetUserNameAsync(user, email);
            await userManager.SetEmailAsync(user, email);
            var result = await userManager.CreateAsync(user, "String!1");

            if (!result.Succeeded)
            {
                Console.WriteLine($"Failed to create user {email}: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
            users.Add(user);
        }
        
        var random = new Random();
        var dateTime = DateTime.Now;

        var records = Enumerable.Range(0, 10_000)
            .Select(_ => new CoffeeRecordEntity
            {
                UserId = users[random.Next(0, users.Count - 1)].Id,
                DateTime = dateTime.AddMinutes(-random.Next(0, 60 * 24 * 365 * 5)),
                Type = _coffeeTypes[random.Next(0, _coffeeTypes.Length - 1)]
            });

        await dbContext.CoffeeRecords.BulkInsertAsync(records);        
    }
}