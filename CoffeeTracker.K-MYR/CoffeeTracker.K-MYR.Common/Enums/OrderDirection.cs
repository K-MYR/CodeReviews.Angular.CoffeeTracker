using System.Text.Json.Serialization;

namespace CoffeeTracker.K_MYR.Common.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum OrderDirection
{
    Ascending = 0,
    Descending = 1,
}
