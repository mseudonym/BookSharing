using BS.Api;
using BS.Api.Implementations;
using BS.Core;
using BS.Data;
using BS.Data.Context;
using BS.Data.Entities;
using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

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
builder.Services.AddBsSwagger();

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

if (environment.IsDevelopment() || environment.IsStaging())
{
    app.UseSwagger();
    app.UseSwaggerUI(swaggerUiOptions =>
    {
        swaggerUiOptions.SwaggerEndpoint("/swagger/v1/swagger.json", "Book sharing API V1");
    });
}

app.Use(async (context, next) =>
{
    if (!context.Request.Headers.ContainsKey("Authorization") &&
        context.Request.Headers.ContainsKey("BsAuthorization"))
    {
        var token = context.Request.Headers["BsAuthorization"].ToString();
        context.Request.Headers["Authorization"] = token;
    }

    await next();
});


app.UseCors();
app.UseHttpLogging();
app.UseAuthentication();
app.UseAuthorization();

app.MapGroup("Auth").WithTags("Auth").MapCustomIdentityApi<UserEntity>();
app.MapControllers();

app.Run();

public class Startup
{
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
    }
}