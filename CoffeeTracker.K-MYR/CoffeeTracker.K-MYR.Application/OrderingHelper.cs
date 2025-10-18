using CoffeeTracker.K_MYR.Domain.Entities;
using System.Reflection;

namespace CoffeeTracker.K_MYR.Application;

public static class OrderingHelper
{
    private static readonly HashSet<string> _allowedProperties = new(StringComparer.OrdinalIgnoreCase)
    {
        nameof(CoffeeRecord.Id),
        nameof(CoffeeRecord.Type),
        nameof(CoffeeRecord.DateTime),
    };

    public static bool IsAllowedProperty(string propertyName)
    {
        return _allowedProperties.Contains(propertyName);
    }

    public static PropertyInfo? GetProperty<T>(string propertyName)
    {
        string[] properties = propertyName.Split('.');
        PropertyInfo? propertyInfo = null;
        Type type = typeof(T);

        foreach (string prop in properties)
        {
            propertyInfo = type.GetProperty(prop, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);

            if (propertyInfo == null)
            {
                return null;
            }

            type = propertyInfo.PropertyType;
        }

        return propertyInfo;
    }
}

