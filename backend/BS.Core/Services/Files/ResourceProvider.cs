using System.Reflection;

namespace BS.Core.Services.Files;

internal static class ResourceProvider
{
    public static string GetEmailConfirmHtml(string confirmationLink) =>
        ReadEmbeddedResource("Files.Email.Confirm.html")
            .Replace("CONFIRM_LINK", confirmationLink);
    public static string GetEmailChangeHtml(string confirmationLink) =>
        ReadEmbeddedResource("Files.Email.Change.html")
            .Replace("CONFIRM_LINK", confirmationLink);

    public static string GetPasswordResetHtml(string passwordResetLink) =>
        ReadEmbeddedResource("Files.Email.PasswordReset.html")
            .Replace("RESET_PASSWORD_LINK", passwordResetLink);

    private static string ReadEmbeddedResource(string fileName)
    {
        var assembly = Assembly.GetExecutingAssembly();
        var resourceName = assembly
            .GetManifestResourceNames()
            .FirstOrDefault(name =>
                name.EndsWith(fileName.Replace('/', '.').Replace('\\', '.'), StringComparison.OrdinalIgnoreCase));

        if (resourceName == null)
            throw new FileNotFoundException($"Embedded resource '{fileName}' not found.");

        using var stream = assembly.GetManifestResourceStream(resourceName);
        using var reader = new StreamReader(stream!);
        return reader.ReadToEnd();
    }
}