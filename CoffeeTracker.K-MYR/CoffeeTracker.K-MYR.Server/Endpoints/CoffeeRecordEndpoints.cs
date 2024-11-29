using CoffeeTracker.K_MYR.Server.Application.Services;
using CoffeeTracker.K_MYR.Server.Domain.Entities;

namespace CoffeeTracker.K_MYR.Server.Endpoints;

public static class CoffeeRecordEndpoints
{
    public static void AddRoutes(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/coffees")
            .WithTags("Coffee API");
                      
        group.MapGet("/{id:int}", async (
            ICoffeeRecordService coffeeRecordService,
            CancellationToken ct,
            int id) =>
        {
            var record = await coffeeRecordService.GetCoffeeRecordAsync(id, ct);
            return record is not null
                ? Results.Ok(record)
                : Results.Problem(
                    statusCode: StatusCodes.Status404NotFound,
                    detail: $"The record with the id {id} was not found."
                );
            
        })
        .WithName("GetCoffeeRecord");

        group.MapGet("/", async (
            ICoffeeRecordService coffeeRecordService,
            CancellationToken ct,
            DateOnly date) =>
        {
            var records = await coffeeRecordService.GetCoffeeRecordsAsync(date, ct);
            return records.Count != 0
                ? Results.Ok(records)
                : Results.Problem(
                    statusCode: StatusCodes.Status404NotFound,
                    detail: $"No records were found."
                );

        })
        .WithName("GetCoffeeRecords");

        group.MapPost("/", async (
            ICoffeeRecordService coffeeRecordService,
            CancellationToken ct,
            CreateCoffeeRecordRequest request) =>
        {
            var record = request.ToDomain();
            await coffeeRecordService.CreateCoffeeRecordAsync(record, ct);
            return Results.CreatedAtRoute(
                routeName: "GetCoffeeRecord",
                routeValues: new { id = record.Id },
                value: CoffeeRecordResponse.FromDomain(record)
            );
        })
        .WithName("PostCoffeeRecord");
        

        group.MapPut("/{id:int}", async (
            ICoffeeRecordService coffeeRecordService,
            CancellationToken ct,
            UpdateCoffeeRecordRequest request,
            int id) =>
        {
            if(id != request.Id)
            {
                return Results.Problem(
                    statusCode: StatusCodes.Status400BadRequest,
                    detail: $"The route value '{id}' does not align with the expected record identifier '{request.Id}'."
                );
            }
            var record = await coffeeRecordService.GetCoffeeRecordAsync(id, ct);
            if(record is null)
            {
                return Results.Problem(
                    statusCode: StatusCodes.Status404NotFound,
                    detail: $"The record with the id {id} was not found."
                );
            }
            record.DateTime = request.DateTime;
            record.Type = request.Type;
            await coffeeRecordService.UpdateCoffeeRecordAsync(record, ct );
            return Results.NoContent();
        })
        .WithName("PutCoffeeRecord");


        group.MapDelete("/{id:int}", async (
            ICoffeeRecordService coffeeRecordService,
            CancellationToken ct,
            int id
            ) =>
        {
            var record = await coffeeRecordService.GetCoffeeRecordAsync(id, ct);
            if (record is null)
            {
                return Results.Problem(
                    statusCode: StatusCodes.Status404NotFound,
                    detail: $"The record with the id {id} was not found."
                );
            }
            await coffeeRecordService.DeleteCoffeeRecordAsync(record, ct);
            return Results.NoContent();
        })
        .WithName("DeleteCoffeeRecord");

    }
}

internal sealed record CreateCoffeeRecordRequest(
    DateTime DateTime, 
    string Type
)
{
    internal CoffeeRecord ToDomain() => new()
    {
        DateTime = DateTime,
        Type = Type
    };
};

internal sealed record CoffeeRecordResponse(
    int Id,
    DateTime DateTime,
    string Type
)
{
    internal static CoffeeRecordResponse FromDomain(CoffeeRecord record) => new(
        record.Id,
        record.DateTime,
        record.Type
    );
};

internal sealed record UpdateCoffeeRecordRequest(
    int Id,
    DateTime DateTime,
    string Type
)
{    internal CoffeeRecord ToDomain() => new()
    {
        Id = Id,
        DateTime = DateTime,
        Type = Type
    };
}

