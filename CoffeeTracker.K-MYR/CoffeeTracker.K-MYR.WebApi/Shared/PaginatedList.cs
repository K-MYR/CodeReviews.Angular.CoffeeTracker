using CoffeeTracker.K_MYR.WebApi.Shared.Enums;

namespace CoffeeTracker.K_MYR.WebApi.Shared;

internal sealed record PaginatedList<T>(
    List<T> Values,
    bool HasNext,
    bool HasPrevious,
    bool IsPrevious,
    string OrderBy,
    OrderDirection OrderDirection
);
