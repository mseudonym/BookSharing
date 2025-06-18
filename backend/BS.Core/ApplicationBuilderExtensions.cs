using BS.Core.Auth;
using BS.Core.Options;
using Hangfire;
using Hangfire.Dashboard;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;

namespace BS.Core;

public static class ApplicationBuilderExtensions
{
    public static WebApplication UseBsHangfire(this WebApplication app)
    {
        IDashboardAuthorizationFilter authorization;
        if (app.Environment.IsDevelopment())
        {
            authorization = new LocalRequestsOnlyAuthorizationFilter();
        }
        else
        {
            var options = app.Services.GetRequiredService<IOptions<InfraAuthOptions>>().Value;
            authorization = new BasicAuthDashboardAuthorizationFilter(options.Username, options.Password);
        }
        
        app.UseHangfireDashboard("/hangfireDashboard", new DashboardOptions {
            AppPath = null, // Отключаем ссылку на приложение
            Authorization = [authorization],
        });
        
        return app;
    }
}