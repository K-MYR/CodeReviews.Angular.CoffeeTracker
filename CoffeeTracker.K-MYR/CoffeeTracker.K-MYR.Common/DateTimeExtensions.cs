namespace CoffeeTracker.K_MYR.Shared;

public static class DateTimeExtensions
{
    public static uint ElapsedDaysOfWeek(this DateTime dateTime, DayOfWeek firstDayOfWeek) 
        => ((uint)(dateTime.Ticks / TimeSpan.TicksPerDay) + 8 - (uint)firstDayOfWeek) % 7;
}