using Microsoft.AspNetCore.Identity;

namespace CoffeeTracker.K_MYR.WebApi.Domain.Entities;

internal sealed class AppUser : IdentityUser<Guid>
{
    public ICollection<CoffeeRecord> CoffeeRecords { get; set; } = [];
}

internal sealed class AppRole : IdentityRole<Guid>
{
}
