using CoffeeTracker.K_MYR.Server.Application.Interfaces;
using CoffeeTracker.K_MYR.Server.Application.Services;
using CoffeeTracker.K_MYR.Server.Domain.Entities;
using CoffeeTracker.K_MYR.Server.Endpoints;
using CoffeeTracker.K_MYR.Server.Persistence.DatabaseContext;
using CoffeeTracker.K_MYR.Server.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOpenApi();
builder.Services.AddAuthorization();
builder.Services.AddAuthentication();
builder.Services.AddProblemDetails();
builder.Services.Configure<RouteHandlerOptions>(options => options.ThrowOnBadRequest = false);
builder.Services.AddOpenApi();
builder.Services.AddDbContext<CoffeeRecordContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default"));
});
builder.Services
    .AddIdentityApiEndpoints<AppUser>()
    .AddEntityFrameworkStores<CoffeeRecordContext>();
builder.Services.AddScoped<ICoffeeRecordService, CoffeeRecordService>();
builder.Services.AddScoped<ICoffeeRecordRepository, CoffeeRecordRepository>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "CoffeeAPI");
    });
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<CoffeeRecordContext>();
    db.Database.Migrate();
}
app.UseExceptionHandler();
app.UseStatusCodePages();
app.UseAuthentication();
app.UseAuthorization();
app.MapAuthEndpoints();
app.MapCoffeeRecordEndpoints();

app.Run();
