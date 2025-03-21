using CoffeeTracker.K_MYR.Server.Domain.Entities;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;

namespace CoffeeTracker.K_MYR.Server.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/account");

        group.MapIdentityApi<AppUser>();

        group.MapGet("/status", Ok () =>
        {
            return TypedResults.Ok();
        }).RequireAuthorization();

        group.MapPost("/logout", async Task<Ok> (SignInManager<AppUser> signInManager) =>
        {
            await signInManager.SignOutAsync();
            return TypedResults.Ok();
        }).RequireAuthorization();
    }
}
