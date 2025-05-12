using BS.Api;
using BS.Api.Implementations;
using BS.Core;
using BS.Data;
using BS.Data.Context;
using BS.Data.Entities;
using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;
var environment = builder.Environment;

builder.Services.AddLogging();
builder.Services.AddHttpLogging(_ => { });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddBsSwagger();

builder.Services.AddControllers();

builder.Services.AddBsCors(environment);
builder.Services.AddBsDbContext(configuration);
builder.Services.AddBsCurrentUserService();
builder.Services.AddBsServices(configuration);

builder.Services.AddAuthorization();
builder.Services.AddAuthentication(BearerTokenDefaults.AuthenticationScheme);
builder.Services.AddIdentityApiEndpoints<UserEntity>(options =>
        {
            options.User.RequireUniqueEmail = true;
            options.Password.RequiredLength = 12;
            options.SignIn.RequireConfirmedEmail = false;
            options.Tokens.EmailConfirmationTokenProvider = TokenOptions.DefaultEmailProvider;
            options.Tokens.PasswordResetTokenProvider = TokenOptions.DefaultPhoneProvider;
        }
    )
    .AddEntityFrameworkStores<BookSharingContext>()
    .AddSignInManager<FixedSignInManager<UserEntity>>();


var app = builder.Build();

if (environment.IsDevelopment() || environment.IsStaging())
{
    app.UseSwagger();
    app.UseSwaggerUI(swaggerUiOptions =>
    {
        swaggerUiOptions.SwaggerEndpoint("/swagger/v1/swagger.json", "Book sharing API V1");
    });
}

app.UseCors();
app.UseHttpLogging();
app.UseAuthentication();
app.UseAuthorization();


app.MapGroup("Auth").WithTags("Auth").MapIdentityApi<UserEntity>();
app.MapControllers();

app.Run();

public class Startup
{
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
    }
}