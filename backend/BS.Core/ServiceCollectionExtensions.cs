using System.Net;
using System.Net.Mail;
using Amazon.S3;
using BS.Core.Models.Mapping;
using BS.Core.Options;
using BS.Core.Services.Book;
using BS.Core.Services.Email;
using BS.Core.Services.Friends;
using BS.Core.Services.Items;
using BS.Core.Services.Queue;
using BS.Core.Services.S3;
using BS.Core.Services.User;
using BS.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace BS.Core;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddBsServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddEmailSender(configuration);
        services.AddCloudCredentials(configuration);
        services.AddS3Client(configuration);
        services.AddModelMappers();
        services.AddCoreServices();

        return services;
    }

    private static void AddEmailSender(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<EmailOptions>(configuration.GetSection(EmailOptions.Section));
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
        services.AddTransient<IEmailSender<UserEntity>, EmailSender>();
        services.AddTransient<EmailSender>();
    }

    private static void AddCloudCredentials(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<YandexCloudCredentialsOptions>(
            configuration.GetRequiredSection(YandexCloudCredentialsOptions.Section));
    }

    public static void AddS3Client(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<YandexCloudS3Options>(configuration.GetRequiredSection(YandexCloudS3Options.Section));
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

    private static void AddCoreServices(this IServiceCollection services)
    {
        services.AddScoped<IFriendsService, FriendsService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IQueueService, QueueService>();
        services.AddScoped<IBookService, BookService>();
        services.AddScoped<IItemService, ItemService>();
    }

    private static void AddModelMappers(this IServiceCollection services)
    {
        services.AddScoped<UserMapper>();
        services.AddScoped<BookMapper>();
    }
}