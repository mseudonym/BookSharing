using BS.Api;
using BS.Api.Endpoints;
using BS.Api.Implementations;
using BS.Core;
using BS.Core.Jobs;
using BS.Data;
using BS.Data.Context;
using BS.Data.Entities;
using Hangfire;
using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);
var configuration = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json", optional: false)
    .AddJsonFile("appsettings.Development.json", optional: true)
    .AddEnvironmentVariables("BS_API__")
    .Build();
var environment = builder.Environment;

builder.Services.AddLogging();
builder.Services.AddHttpLogging(_ => { });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddBsOpenApi(builder.Environment);
builder.Services.AddBsHangfire(configuration);

builder.Services.AddControllers();

builder.Services.AddBsCors(environment);
builder.Services.AddBsDbContext(configuration);
builder.Services.AddBsCurrentUserService();
builder.Services.AddBsServices(configuration, builder.Environment);

builder.Services.AddAuthorization();
builder.Services.AddAuthentication(BearerTokenDefaults.AuthenticationScheme);
builder.Services.AddIdentityApiEndpoints<UserEntity>(options =>
        {
            options.User.RequireUniqueEmail = true;
            options.Password.RequiredLength = 12;
            options.Password.RequireNonAlphanumeric = false;
            options.SignIn.RequireConfirmedEmail = false;
        }
    )
    .AddEntityFrameworkStores<BookSharingContext>()
    .AddSignInManager<FixedSignInManager<UserEntity>>();


var app = builder.Build();

// Автоматическое применение миграций
if (app.Environment.IsProduction() || app.Environment.IsStaging())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<BookSharingContext>();
    db.Database.Migrate();
}

app.UseHangfireServer(() => new BackgroundJobServer());
if (environment.IsDevelopment() || environment.IsStaging())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options =>
    {
        options.Servers = options.Servers;
    });
}

app.UseBsHangfire();
app.UseCors();
app.UseHttpLogging();
app.UseAuthentication();
app.UseAuthorization();

app.MapNotificationsEndpoints();
app.MapCustomIdentityEndpoints<UserEntity>();
app.MapControllers();

RecurringJob.AddOrUpdate<HolderReadingReminderJob>(
    "notify-reading-progress-every-week",
    job => job.RunAsync(),
    Cron.Daily
);

app.Run();

public class Startup
{
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
    }
}