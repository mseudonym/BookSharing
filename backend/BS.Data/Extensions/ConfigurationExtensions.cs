using BS.Data.Options;
using Microsoft.Extensions.Configuration;

namespace BS.Data.Extensions;

public static class ConfigurationExtensions
{
    public static ConnectionStringsOptions GetConnectionStringsOptions(this IConfiguration configuration) =>
        configuration.GetRequiredSection(ConnectionStringsOptions.Section)
            .Get<ConnectionStringsOptions>()
        ?? throw new NullReferenceException($"Configuration section \"{nameof(ConnectionStringsOptions)}\" is missing");
}