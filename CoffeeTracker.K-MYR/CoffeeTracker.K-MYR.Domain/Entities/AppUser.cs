using Microsoft.AspNetCore.Identity;

namespace CoffeeTracker.K_MYR.Domain.Entities;

public sealed class AppUser : IdentityUser<Guid>
{
    public ICollection<CoffeeRecord> CoffeeRecords { get; set; } = [];
}

public sealed class AppRole : IdentityRole<Guid>
{
}
