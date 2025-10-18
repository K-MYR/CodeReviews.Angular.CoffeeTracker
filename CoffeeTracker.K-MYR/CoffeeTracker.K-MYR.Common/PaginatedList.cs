using CoffeeTracker.K_MYR.Common.Enums;

namespace CoffeeTracker.K_MYR.Common;

public sealed record PaginatedList<T>(
    List<T> Values,
    bool HasNext,
    bool HasPrevious,
    bool IsPrevious,
    string OrderBy,
    OrderDirection OrderDirection
);
