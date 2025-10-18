using Microsoft.AspNetCore.Identity;

namespace CoffeeTracker.K_MYR.Persistence.Entities;

public sealed class AppUser : IdentityUser<Guid>
{
    public ICollection<CoffeeRecordEntity> CoffeeRecords { get; set; } = [];
}

public sealed class AppRole : IdentityRole<Guid>
{
}
