using CoffeeTracker.K_MYR.Common;
using CoffeeTracker.K_MYR.RazorClassLib.Services;
using CoffeeTracker.K_MYR.Application.Interfaces;
using CoffeeTracker.K_MYR.Application.Services;
using CoffeeTracker.K_MYR.Domain.Entities;
using CoffeeTracker.K_MYR.WebApi.Endpoints;
using CoffeeTracker.K_MYR.WebApi.Infrastructure.Email;
using CoffeeTracker.K_MYR.WebApi.Infrastructure.Extensions;
using CoffeeTracker.K_MYR.WebApi.Infrastructure.Spa;
using CoffeeTracker.K_MYR.Persistence.DatabaseContexts;
using CoffeeTracker.K_MYR.Persistence.Repositories;
using Microsoft.AspNetCore.Identity;
using System.Threading.Channels;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.AddServiceDefaults();
builder.Services.AddOpenApi();
builder.Services.AddAuthorization();
builder.Services.AddAuthentication();
builder.Services.AddProblemDetails();
builder.Services.AddDbContext<CoffeeRecordContext>(options =>
{
    options.UseNpgsql(
        builder.Configuration.GetConnectionString(ResourceNames.Database)
    );
});
builder.Services
    .AddIdentityApiEndpoints<AppUser>(options =>
    {
        options.User.RequireUniqueEmail = true;
    })
    .AddEntityFrameworkStores<CoffeeRecordContext>();
builder.Services
    .AddMvcCore()
    .AddRazorViewEngine();
builder.Services.AddScoped<ICoffeeRecordService, CoffeeRecordService>();
builder.Services.AddScoped<ICoffeeRecordRepository, CoffeeRecordRepository>();
builder.Services.AddTransient<IEmailSender<AppUser>, EmailService>();
builder.Services.AddTransient<IRazorViewToStringRenderer, RazorViewToStringRenderer>();
builder.Services.AddHostedService<EmailProcessor>();
builder.Services.AddSingleton(Channel.CreateBounded<EmailChannelRequest>(
    new BoundedChannelOptions(1000)
    {
        SingleReader = true,
        AllowSynchronousContinuations = false,
        FullMode = BoundedChannelFullMode.Wait,
    }
));


builder.Services.Configure<SpaConfiguration>(
    builder.Configuration.GetSection(SpaConfiguration.Key))
    .AddOptionsWithValidateOnStart<EmailConfiguration>()
    .ValidateDataAnnotations();
builder.Services.Configure<RouteHandlerOptions>(options =>
{
    options.ThrowOnBadRequest = false;
});
builder.Services.ConfigureApplicationCookie(options =>
{
    options.ExpireTimeSpan = TimeSpan.FromDays(14);
    options.SlidingExpiration = true;
});

builder.ConfigureEmailOptions();
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "CoffeeAPI");
    });
}
app.UseExceptionHandler();
app.UseStatusCodePages();
app.UseAuthentication();
app.UseAuthorization();
app.MapAuthEndpoints();
app.MapCoffeeRecordEndpoints();
app.Run();
