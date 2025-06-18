using System.Text;
using Hangfire.Dashboard;
using Microsoft.AspNetCore.Http;

namespace BS.Core.Auth;

public class BasicAuthDashboardAuthorizationFilter : IDashboardAuthorizationFilter
{
    private readonly string _username;
    private readonly string _password;

    public BasicAuthDashboardAuthorizationFilter(string username, string password)
    {
        _username = username;
        _password = password;
    }

    public bool Authorize(DashboardContext context)
    {
        var httpContext = context.GetHttpContext();

        string authHeader = httpContext.Request.Headers["Authorization"]!;

        if (string.IsNullOrWhiteSpace(authHeader))
        {
            Challenge(httpContext);
            return false;
        }

        if (!authHeader.StartsWith("Basic ", StringComparison.OrdinalIgnoreCase))
        {
            Challenge(httpContext);
            return false;
        }

        var encodedCredentials = authHeader.Substring("Basic ".Length).Trim();
        var credentialBytes = Convert.FromBase64String(encodedCredentials);
        var credentials = Encoding.UTF8.GetString(credentialBytes).Split(':', 2);

        if (credentials.Length != 2)
        {
            Challenge(httpContext);
            return false;
        }

        var username = credentials[0];
        var password = credentials[1];

        if (username == _username && password == _password)
        {
            return true;
        }

        Challenge(httpContext);
        return false;
    }

    private void Challenge(HttpContext context)
    {
        context.Response.StatusCode = 401;
        context.Response.Headers["WWW-Authenticate"] = "Basic realm=\"Hangfire Dashboard\"";
    }
}