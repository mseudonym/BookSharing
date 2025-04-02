using BS.Data.Context;
using BS.Data.Options;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace BS.Data;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddBsDbContext(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddPostgresClient(configuration);
        
        return services;
    }
    
    private static void AddPostgresClient(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<ConnectionStringsOptions>(configuration.GetSection(ConnectionStringsOptions.Section));
        
        var dbOptions = configuration.GetRequiredSection(ConnectionStringsOptions.Section).Get<ConnectionStringsOptions>() 
                        ?? throw new NullReferenceException($"Configuration section \"{nameof(ConnectionStringsOptions)}\" is missing");
        services.AddDbContext<BookSharingContext>(options => options.UseNpgsql(dbOptions.Postgres));
    }
}