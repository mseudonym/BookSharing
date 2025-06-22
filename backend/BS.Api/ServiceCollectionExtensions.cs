using BS.Api.Implementations;
using BS.Core.Services.User;
using Microsoft.OpenApi.Models;

namespace BS.Api;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddBsCurrentUserService(this IServiceCollection services)
    {
        services.AddHttpContextAccessor();
        services.AddScoped<ICurrentUserService, CurrentUserService>();

        return services;
    }

    public static IServiceCollection AddBsOpenApi(this IServiceCollection services, IWebHostEnvironment environment)
    {
        services.AddOpenApi(options =>
        {
            options.AddDocumentTransformer((document, _, _) =>
            {
                // При локальном запуске оставляем http
                if (!environment.IsDevelopment())
                {
                    foreach (var server in document.Servers)
                    {
                        server.Url = server.Url.Replace("http", "https");
                    }
                }
                
                document.Components ??= new OpenApiComponents();
                document.Components.SecuritySchemes ??= new Dictionary<string, OpenApiSecurityScheme>();

                document.Components.SecuritySchemes["Bearer"] = new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Введите JWT токен",
                };
                document.SecurityRequirements.Add(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer",
                            }
                        },
                        new List<string>()
                    },
                });

                return Task.CompletedTask;
            });
        });
        return services;
    }

    public static IServiceCollection AddBsCors(
        this IServiceCollection services,
        IWebHostEnvironment environment)
    {
        services.AddCors(options =>
        {
            options.AddDefaultPolicy(
                policy =>
                {
                    if (environment.IsProduction())
                        policy
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .AllowCredentials()
                            .WithOrigins(
                                "https://book-sharing.ru"
                            );

                    if (environment.IsStaging() || environment.IsDevelopment())
                        policy
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .AllowCredentials()
                            .SetIsOriginAllowed(origin =>
                            {
                                var uri = new Uri(origin);
                                return uri.Host == "localhost" || origin == "https://staging.book-sharing.ru";
                            });
                });
        });
        return services;
    }
}