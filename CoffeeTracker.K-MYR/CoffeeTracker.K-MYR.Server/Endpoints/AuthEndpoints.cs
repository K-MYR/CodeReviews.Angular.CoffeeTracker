using CoffeeTracker.K_MYR.Server.Domain.Entities;
using Microsoft.AspNetCore.Http.HttpResults;

namespace CoffeeTracker.K_MYR.Server.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/account");

        group.MapIdentityApi<AppUser>();

        group.MapGet("/status", Ok() =>
        {
            return TypedResults.Ok();
        }).RequireAuthorization();
    }
}
