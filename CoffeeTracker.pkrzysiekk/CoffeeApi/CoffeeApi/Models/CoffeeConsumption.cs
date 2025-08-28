using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Text.Json.Serialization;

namespace CoffeeApi.Models;

public class CoffeeConsumption
{
    public int Id { get; set; }
    [JsonPropertyName("typeOfCoffee")]
    public required string  TypeOfCoffee { get; set; } 
    [JsonPropertyName("amount")] 
    [Range(1, int.MaxValue,ErrorMessage="Amount must be greater than 0")]
    public int Amount { get; set; }
    [JsonPropertyName("consumedAt")]
    public DateTime ConsumedAt { get; set; }
    [JsonPropertyName("caffeine")]
    [Range(0,int.MaxValue,ErrorMessage="Caffeine must be greater than 0")]
    public int Caffeine { get; set; }
}