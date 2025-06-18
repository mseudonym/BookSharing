using System.Net;
using System.Net.Mail;
using Amazon.S3;
using BS.Core.Models.Mapping;
using BS.Core.Options;
using BS.Core.Services.Book;
using BS.Core.Services.Email;
using BS.Core.Services.Friends;
using BS.Core.Services.Items;
using BS.Core.Services.Notifications;
using BS.Core.Services.S3;
using BS.Core.Services.User;
using BS.Data.Entities;
using BS.Data.Extensions;
using Hangfire;
using Hangfire.PostgreSql;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace BS.Core;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddBsServices(this IServiceCollection services, IConfiguration configuration,
        IWebHostEnvironment environment)
    {
        services.AddBsOptions(configuration);
        services.AddEmailSender();
        services.AddS3Client(configuration, environment);
        services.AddModelMappers();
        services.AddCoreServices();

        return services;
    }

    private static void AddBsOptions(this IServiceCollection services, IConfiguration configuration)
    {
        services.ConfigureByName<EmailOptions>(configuration);
        services.ConfigureByName<FrontendOptions>(configuration);
        services.ConfigureByName<YandexCloudS3Options>(configuration);
        services.ConfigureByName<YandexCloudCredentialsOptions>(configuration);
        services.ConfigureByName<PaginationOptions>(configuration);
        services.ConfigureByName<NotificationOptions>(configuration);
        services.ConfigureByName<InfraAuthOptions>(configuration);
    }

    private static void AddEmailSender(this IServiceCollection services)
    {
        services.AddTransient<SmtpClient>(sp =>
        {
            var emailOptions = sp.GetRequiredService<IOptions<EmailOptions>>().Value;

            return new SmtpClient
            {
                Host = emailOptions.Host,
                Port = emailOptions.Port,
                Credentials = new NetworkCredential(emailOptions.Username, emailOptions.Password),
                EnableSsl = true,
            };
        });
        services.AddTransient<ICustomEmailSender<UserEntity>, CustomEmailSender>();
    }

    public static void AddS3Client(this IServiceCollection services, IConfiguration configuration,
        IWebHostEnvironment environment)
    {
        services.AddSingleton<IAmazonS3>(sp =>
        {
            var yandexCloudCredentialsOptions = sp.GetRequiredService<IOptions<YandexCloudCredentialsOptions>>().Value;
            var yandexCloudS3Options = sp.GetRequiredService<IOptions<YandexCloudS3Options>>().Value;
            return new AmazonS3Client(
                yandexCloudCredentialsOptions.AccessKey,
                yandexCloudCredentialsOptions.SecretKey,
                new AmazonS3Config
                {
                    ServiceURL = yandexCloudS3Options.Url,
                }
            );
        });
        services.AddScoped<IS3Service, S3Service>();
    }
    
    public static IServiceCollection AddBsHangfire(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var dbOptions = configuration.GetConnectionStringsOptions();
        
        services.AddHangfire(config => config
            .UseSimpleAssemblyNameTypeSerializer()
            .UseRecommendedSerializerSettings()
            .UsePostgreSqlStorage(options =>
            {
                options.UseNpgsqlConnection(dbOptions.Postgres);
            })
        );
        services.AddHangfireServer();
        return services;
    }

    private static void AddCoreServices(this IServiceCollection services)
    {
        services.AddScoped<IFriendsService, FriendsService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IBookService, BookService>();
        services.AddScoped<IItemService, ItemService>();
        services.AddScoped<INotificationsService, NotificationService>();
    }

    private static void AddModelMappers(this IServiceCollection services)
    {
        services.AddScoped<UserMapper>();
        services.AddScoped<BookMapper>();
        services.AddScoped<NotificationMapper>();
    }
    
    private static void ConfigureByName<TOptions>(this IServiceCollection services, IConfiguration configuration)
        where TOptions : class
    {
        services.Configure<TOptions>(configuration.GetSection(typeof(TOptions).Name));
    }
}