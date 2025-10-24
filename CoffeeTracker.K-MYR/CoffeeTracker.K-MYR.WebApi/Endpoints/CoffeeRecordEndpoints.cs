using CoffeeTracker.K_MYR.Application.DTOs;
using CoffeeTracker.K_MYR.Application.Enums;
using CoffeeTracker.K_MYR.Application.Services;
using CoffeeTracker.K_MYR.Common;
using CoffeeTracker.K_MYR.Common.Enums;
using CoffeeTracker.K_MYR.Domain.Entities;
using LanguageExt;
using LanguageExt.Pipes;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Reflection;
using System.Security.Claims;

namespace CoffeeTracker.K_MYR.WebApi.Endpoints;

public static class CoffeeRecordEndpoints
{
    public static void MapCoffeeRecordEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/coffees")
            .WithTags("Coffee API");

        group.MapGet("/{id:int}", async Task<Results<Ok<CoffeeRecordResponse>, ProblemHttpResult>> (
            ClaimsPrincipal user,
            ICoffeeRecordService coffeeRecordService,
            CancellationToken ct,
            int id) =>
        {
            var userId = user.GetUserId();
            var record = await coffeeRecordService.GetCoffeeRecordAsync(id, userId, ct);
            return record is not null
                ? TypedResults.Ok(CoffeeRecordResponse.FromDomain(record))
                : TypedResults.Problem(
                    statusCode: StatusCodes.Status404NotFound,
                    detail: $"The record with the id {id} was not found."
                );

        })
        .WithName("GetCoffeeRecord")
        .RequireAuthorization();

        group.MapGet("/", async Task<Results<Ok<PaginatedList<CoffeeRecordResponse>>, ProblemHttpResult>> (
            ClaimsPrincipal user,
            ICoffeeRecordService coffeeRecordService,
            CancellationToken ct,
            PagingData pagingData,
            [AsParameters] GetCoffeeRecordsRequest request) =>
        {
            var userId = user.GetUserId();
            var result = await coffeeRecordService.GetCoffeeRecordsAsync(
                userId,
                request.DateTimeFrom,
                request.DateTimeTo,
                request.Type,
                pagingData.OrderBy,
                pagingData.LastId,
                pagingData.LastValue,
                pagingData.PageSize,
                pagingData.IsPrevious,
                pagingData.OrderDirection,
                ct
            );

            return result.Match<Results<Ok<PaginatedList<CoffeeRecordResponse>>, ProblemHttpResult>>(
                succ => TypedResults.Ok(new PaginatedList<CoffeeRecordResponse>(
                        succ.Values
                            .Select(c => CoffeeRecordResponse.FromDomain(c))
                            .ToList(),
                        succ.HasNext,
                        succ.HasPrevious,
                        succ.IsPrevious,
                        succ.OrderBy,
                        succ.OrderDirection
                    )),
                fail => TypedResults.Problem(
                        statusCode: StatusCodes.Status400BadRequest,
                        detail: fail.Message
                    )
            );
        })
        .WithName("GetCoffeeRecords")
        .RequireAuthorization();

        group.MapGet("/statistics", async Task<Results<Ok<List<TypeStatisticsDTO>>, ProblemHttpResult>> (
            ClaimsPrincipal user,
            ICoffeeRecordService coffeeRecordService,
            CancellationToken ct,
            DateTime date) =>
        {
            var userId = user.GetUserId();
            var statisticsDTOs = await coffeeRecordService.GetStatistics(date, userId, ct);
            return TypedResults.Ok(statisticsDTOs);

        })
        .WithName("GetCoffeeTypeStatistics")
        .RequireAuthorization();

        group.MapPost("/", async Task<CreatedAtRoute<CoffeeRecordResponse>> (
            ClaimsPrincipal user,
            ICoffeeRecordService coffeeRecordService,
            CancellationToken ct,
            CreateCoffeeRecordRequest request) =>
        {
            var userId = user.GetUserId();
            var record = request.ToDomain(userId);
            await coffeeRecordService.CreateCoffeeRecordAsync(record, ct);
            return TypedResults.CreatedAtRoute(
                routeName: "GetCoffeeRecord",
                routeValues: new { id = record.Id },
                value: CoffeeRecordResponse.FromDomain(record)
            );
        })
        .WithName("PostCoffeeRecord")
        .RequireAuthorization();


        group.MapPut("/{id:int}", async Task<Results<NoContent, ProblemHttpResult>> (
            ClaimsPrincipal user,
            ICoffeeRecordService coffeeRecordService,
            CancellationToken ct,
            UpdateCoffeeRecordRequest request,
            int id) =>
        {
            if (id != request.Id)
            {
                return TypedResults.Problem(
                    statusCode: StatusCodes.Status400BadRequest,
                    detail: $"The route value '{id}' does not align with the expected record identifier '{request.Id}'."
                );
            }

            var userId = user.GetUserId();
            var record = await coffeeRecordService.GetCoffeeRecordAsync(id, userId, ct);

            if (record is null)
            {
                return TypedResults.Problem(
                    statusCode: StatusCodes.Status404NotFound,
                    detail: $"The record with the id {id} was not found."
                );
            }

            record.DateTime = request.DateTime;
            record.Type = request.Type;
            await coffeeRecordService.UpdateCoffeeRecordAsync(record, ct);
            return TypedResults.NoContent();
        })
        .WithName("PutCoffeeRecord")
        .RequireAuthorization();


        group.MapDelete("/{id:int}", async Task<Results<NoContent, ProblemHttpResult>> (
            ClaimsPrincipal user,
            ICoffeeRecordService coffeeRecordService,
            CancellationToken ct,
            int id
            ) =>
        {
            var userId = user.GetUserId();
            var record = await coffeeRecordService.GetCoffeeRecordAsync(id, userId, ct);
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
        .WithName("DeleteCoffeeRecord")
        .RequireAuthorization();
    }
}

internal sealed record GetCoffeeRecordsRequest(
    DateTime? DateTimeFrom,
    DateTime? DateTimeTo,
    string? Type
);

internal sealed record CreateCoffeeRecordRequest(
    DateTime DateTime,
    string Type
)
{
    internal CoffeeRecord ToDomain(Guid userId) => new()
    {
        DateTime = DateTime,
        Type = Type.Trim(),
        UserId = userId
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
{
    internal CoffeeRecord ToDomain(Guid userId) => new()
    {
        Id = Id,
        DateTime = DateTime,
        Type = Type.Trim(),
        UserId = userId
    };
}

internal sealed record PagingData(
    int? LastId,
    string? LastValue,
    CoffeeRecordOrderBy OrderBy = CoffeeRecordOrderBy.Id,
    int PageSize = 10,
    bool IsPrevious = false,
    OrderDirection OrderDirection = OrderDirection.Ascending) : IBindableFromHttpContext<PagingData>
{
    const string lastIdKey = "lastId";
    const string lastValueKey = "lastValue";
    const string orderByKey = "orderBy";
    const string orderDirectionKey = "orderDirection";
    const string pageSizeKey = "pageSize";
    const string isPreviousKey = "isPrevious";

    public static ValueTask<PagingData?> BindAsync(HttpContext context, ParameterInfo parameter)
    {
        var query = context.Request.Query;

        int? lastId = null;
        if (query.TryGetValue(lastIdKey, out var lastIdStr))
        {
            if (!int.TryParse(lastIdStr, out var parsedLastId))
            {
                return ValueTask.FromResult<PagingData?>(null);
            }
            lastId = parsedLastId;
        }

        string? lastValue = query.TryGetValue(lastValueKey, out var lvStr) ? lvStr.ToString() : null;       

        var orderBy = CoffeeRecordOrderBy.Id;
        if (query.TryGetValue(orderByKey, out var orderByStr) && !Enum.TryParse(orderByStr, true, out orderBy))
        {
            return ValueTask.FromResult<PagingData?>(null);
        }

        int pageSize = 10;
        if (query.TryGetValue(pageSizeKey, out var pageSizeStr) && !int.TryParse(pageSizeStr, out pageSize))
        {
            return ValueTask.FromResult<PagingData?>(null);
        }

        bool isPrevious = false;
        if (query.TryGetValue(isPreviousKey, out var isPreviousStr) && !bool.TryParse(isPreviousStr, out isPrevious))
        {
            return ValueTask.FromResult<PagingData?>(null);
        }

        var orderDirection = OrderDirection.Ascending;
        if (query.TryGetValue(orderDirectionKey, out var odStr))
        {
            if (Enum.TryParse<OrderDirection>(odStr, true, out var parsed) 
                && Enum.IsDefined(parsed))
            {
                orderDirection = parsed;
            }
            else
            {
                return ValueTask.FromResult<PagingData?>(null);
            }
        }

        var result = new PagingData(
            LastId: lastId,
            LastValue: lastValue,
            OrderBy: orderBy,
            PageSize: pageSize,
            IsPrevious: isPrevious,
            OrderDirection: orderDirection);

        return ValueTask.FromResult<PagingData?>(result);
    }
}
