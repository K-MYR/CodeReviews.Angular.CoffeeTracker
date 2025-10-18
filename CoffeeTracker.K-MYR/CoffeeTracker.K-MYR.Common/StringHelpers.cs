namespace CoffeeTracker.K_MYR.Common;
public static class StringHelpers
{
    public static Dictionary<string, string> ConnectionStringToDictionary(string connectionString, char separator = ';')
    {
        Dictionary<string, string> dictionary = [];
        var pairs = connectionString.Split(separator);
        for (int i = 0; i < pairs.Length; i++)
        {
            var pair = pairs[i].Split('=');

            if (pair.Length != 2 || string.IsNullOrWhiteSpace(pair[0]) || string.IsNullOrWhiteSpace(pair[1]))
            {
                continue;
            }

            dictionary[pair[0]] = pair[1];
        }

        return dictionary;
    }
}
