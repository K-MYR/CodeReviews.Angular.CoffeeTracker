using CoffeeTracker.K_MYR.Common;
using CoffeeTracker.K_MYR.MigrationService;
using CoffeeTracker.K_MYR.Persistence.DatabaseContexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

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

var host = builder.Build();
host.Run();