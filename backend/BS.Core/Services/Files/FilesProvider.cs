using System.Reflection;

namespace BS.Core.Services.Files;

internal static class FilesProvider
{
    private const string EmailConfirmHtmlResourcePath = @"Files\Email\Confirm.html";
    private const string ResetCodeHtmlResourcePath = @"Files\Email\PasswordResetCode.html";

    public static string GetEmailConfirmHtml(string confirmationLink) =>
        ReadFile(EmailConfirmHtmlResourcePath)
            .Replace("CONFIRM_LINK", confirmationLink);

    public static string GetResetCodeHtml(string resetCode) =>
        ReadFile(ResetCodeHtmlResourcePath)
            .Replace("RESET_CODE", resetCode);


    private static string ReadFile(string fileName)
    {
        var directory = Path.GetDirectoryName(Assembly.GetEntryAssembly()!.Location)!;
        using var stream = File.OpenRead(Path.Combine(directory, fileName));
        if (stream == null)
        {
            throw new FileNotFoundException("File not found", fileName);
        }

        using var reader = new StreamReader(stream);
        return reader.ReadToEnd();
    }
}