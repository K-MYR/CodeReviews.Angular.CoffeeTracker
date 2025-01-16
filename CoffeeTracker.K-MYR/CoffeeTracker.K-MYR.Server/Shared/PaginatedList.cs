using CoffeeTracker.K_MYR.Server.Shared.Enums;

namespace CoffeeTracker.K_MYR.Server.Shared;

internal sealed record PaginatedList<T>(
    List<T> Values,
    bool HasNext,
    bool HasPrevious,
    string OrderBy,
    OrderDirection OrderDirection
);
