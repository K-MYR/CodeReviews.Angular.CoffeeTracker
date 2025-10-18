using CoffeeTracker.K_MYR.Common;
using CoffeeTracker.K_MYR.MigrationService;
using CoffeeTracker.K_MYR.Persistence.DatabaseContexts;
using CoffeeTracker.K_MYR.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

var builder = Host.CreateApplicationBuilder(args);

builder.AddServiceDefaults();
builder.Services.AddHostedService<Worker>();

builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing.AddSource(Worker.ActivitySourceName));
builder.Services.AddDbContext<CoffeeRecordContext>(options =>
{
    options.UseNpgsql(
        builder.Configuration.GetConnectionString(ResourceNames.Database)
    );
});

builder.Services.AddIdentityCore<AppUser>()
    .AddEntityFrameworkStores<CoffeeRecordContext>();

var host = builder.Build();
host.Run(); 