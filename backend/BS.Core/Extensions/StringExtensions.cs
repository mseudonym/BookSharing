namespace BS.Core.Extensions;

public static class StringExtensions
{
    private const char IsbnChar = 'X';

    // TODO: сделать норм проверку
    public static bool IsValidIsbn(this string isbn, out string validIsbn)
    {
        // Убираем все нецифровые символы (пробелы, тире и т.д.)
        validIsbn = new string(isbn.Where(c => char.IsDigit(c) || c == IsbnChar).ToArray());

        return validIsbn.All(char.IsDigit) ||
               (validIsbn.Length == 10 && validIsbn[..9].All(char.IsDigit) && validIsbn.IndexOf(IsbnChar) == 9);
    }
}