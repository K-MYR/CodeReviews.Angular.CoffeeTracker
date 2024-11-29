using CoffeeTracker.K_MYR.Server.Application.Interfaces;
using CoffeeTracker.K_MYR.Server.Application.Services;
using CoffeeTracker.K_MYR.Server.Endpoints;
using CoffeeTracker.K_MYR.Server.Persistence.DatabaseContext;
using CoffeeTracker.K_MYR.Server.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddProblemDetails();
builder.Services.Configure<RouteHandlerOptions>(options => options.ThrowOnBadRequest = false);
builder.Services.AddOpenApi();
builder.Services.AddDbContext<CoffeeRecordContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default"));
});
builder.Services.AddScoped<ICoffeeRecordService, CoffeeRecordService>();
builder.Services.AddScoped<ICoffeeRecordRepository, CoffeeRecordRepository>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<CoffeeRecordContext>();
    db.Database.Migrate();
}

app.AddRoutes();
app.UseExceptionHandler();
app.UseStatusCodePages();
app.Run();
