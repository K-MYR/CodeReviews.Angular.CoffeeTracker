using System.Text.Json.Serialization;

namespace CoffeeApi.Models;

public class CoffeeConsumption
{
    public int Id { get; set; }
    [JsonPropertyName("typeOfCoffee")]
    public required string  TypeOfCoffee { get; set; } 
    [JsonPropertyName("consumedAt")]
    public DateTime ConsumedAt { get; set; }
    [JsonPropertyName("caffeine")]
    public int Caffeine { get; set; }
}