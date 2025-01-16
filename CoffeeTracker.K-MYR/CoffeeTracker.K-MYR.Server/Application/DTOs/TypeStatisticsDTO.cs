namespace CoffeeTracker.K_MYR.Server.Application.DTOs;

internal sealed class TypeStatisticsDTO
{
    public required string CoffeeType { get; set; }

    public required int YearCount { get; set; }
    public required int MonthCount { get; set; }
    public required int WeekCount { get; set; }
    public required int DayCount { get; set; }

}
