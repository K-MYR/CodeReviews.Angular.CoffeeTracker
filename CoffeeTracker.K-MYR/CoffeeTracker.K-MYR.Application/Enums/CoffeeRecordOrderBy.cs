using System.Text.Json.Serialization;

namespace CoffeeTracker.K_MYR.Application.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum CoffeeRecordOrderBy
{
    Id,
    Type,
    DateTime,
}
