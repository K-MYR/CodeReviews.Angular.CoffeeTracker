using CoffeeTracker.K_MYR.Server.Application.DTOs;
using CoffeeTracker.K_MYR.Server.Application.Services;
using CoffeeTracker.K_MYR.Server.Domain.Entities;
using CoffeeTracker.K_MYR.Server.Shared;
using CoffeeTracker.K_MYR.Server.Shared.Enums;
using LanguageExt;
using Microsoft.AspNetCore.Http.HttpResults;

namespace CoffeeTracker.K_MYR.Server.Endpoints;

public static class CoffeeRecordEndpoints
{
    public static void AddRoutes(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/coffees")
            .WithTags("Coffee API");
                      
        group.MapGet("/{id:int}", async Task<Results<Ok<CoffeeRecordResponse>, ProblemHttpResult>>(
            ICoffeeRecordService coffeeRecordService,
            CancellationToken ct,
            int id) =>
        {
            var record = await coffeeRecordService.GetCoffeeRecordAsync(id, ct);
            return record is not null
                ? TypedResults.Ok(CoffeeRecordResponse.FromDomain(record))
                : TypedResults.Problem(
                    statusCode: StatusCodes.Status404NotFound,
                    detail: $"The record with the id {id} was not found."
                );
            
        })
        .WithName("GetCoffeeRecord");

        group.MapGet("/", async Task<Results<Ok<PaginatedList<CoffeeRecordResponse>>, ProblemHttpResult>> (
            ICoffeeRecordService coffeeRecordService,
            CancellationToken ct,
            [AsParameters] GetCoffeeRecordsRequest request) =>
        {
            var result = await coffeeRecordService.GetCoffeeRecordsAsync(request, ct);
            

            return result.Match<Results<Ok<PaginatedList<CoffeeRecordResponse>>, ProblemHttpResult>>(
                succ => TypedResults.Ok(new PaginatedList<CoffeeRecordResponse>(
                        succ.Values
                            .Select(c => CoffeeRecordResponse.FromDomain(c))
                            .ToList(),
                        succ.HasNext,
                        succ.HasPrevious,
                        succ.OrderBy,
                        succ.OrderDirection
                    )),                   
                fail => TypedResults.Problem(
                        statusCode: StatusCodes.Status400BadRequest,
                        detail: fail.Message
                    )
            );
        })
        .WithName("GetCoffeeRecords");

        group.MapGet("/statistics", async Task<Results<Ok<List<TypeStatisticsDTO>>, ProblemHttpResult>> (
            ICoffeeRecordService coffeeRecordService,
            CancellationToken ct,
            DateTime date) =>
        {
            var statisticsDTOs = await coffeeRecordService.GetStatistics(date, ct);
            return TypedResults.Ok(statisticsDTOs);

        })
        .WithName("GetCoffeeTypeStatistics");

        group.MapPost("/", async Task<CreatedAtRoute<CoffeeRecordResponse>>(
            ICoffeeRecordService coffeeRecordService,
            CancellationToken ct,
            CreateCoffeeRecordRequest request) =>
        {
            var record = request.ToDomain();
            await coffeeRecordService.CreateCoffeeRecordAsync(record, ct);
            return TypedResults.CreatedAtRoute(
                routeName: "GetCoffeeRecord",
                routeValues: new { id = record.Id },
                value: CoffeeRecordResponse.FromDomain(record)
            );
        })
        .WithName("PostCoffeeRecord");
        

        group.MapPut("/{id:int}", async Task<Results<NoContent, ProblemHttpResult >>(
            ICoffeeRecordService coffeeRecordService,
            CancellationToken ct,
            UpdateCoffeeRecordRequest request,
            int id) =>
        {
            if(id != request.Id)
            {
                return TypedResults.Problem(
                    statusCode: StatusCodes.Status400BadRequest,
                    detail: $"The route value '{id}' does not align with the expected record identifier '{request.Id}'."
                );
            }

            var record = await coffeeRecordService.GetCoffeeRecordAsync(id, ct);

            if(record is null)
            {
                return TypedResults.Problem(
                    statusCode: StatusCodes.Status404NotFound,
                    detail: $"The record with the id {id} was not found."
                );
            }

            record.DateTime = request.DateTime;
            record.Type = request.Type;
            await coffeeRecordService.UpdateCoffeeRecordAsync(record, ct );
            return TypedResults.NoContent();
        })
        .WithName("PutCoffeeRecord");


        group.MapDelete("/{id:int}", async Task<Results<NoContent, ProblemHttpResult>>(
            ICoffeeRecordService coffeeRecordService,
            CancellationToken ct,
            int id
            ) =>
        {
            var record = await coffeeRecordService.GetCoffeeRecordAsync(id, ct);
            if (record is null)
            {
                return TypedResults.Problem(
                    statusCode: StatusCodes.Status404NotFound,
                    detail: $"The record with the id {id} was not found."
                );
            }
            await coffeeRecordService.DeleteCoffeeRecordAsync(record, ct);
            return TypedResults.NoContent();
        })
        .WithName("DeleteCoffeeRecord");

    }
}

internal sealed record GetCoffeeRecordsRequest(        
    DateTime? DateTimeFrom,
    DateTime? DateTimeTo,
    string? Type,
    string? OrderBy,
    int? LastId,
    string? LastValue,
    int PageSize = 10,
    bool IsPrevious = false,    
    OrderDirection OrderDirection = OrderDirection.Ascending
);

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
}

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
}

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

