using Bogus.DataSets;

namespace BS.IntegrationTests.Extensions;

public static class BogusExtensions
{
    public static string UserName(this Name _, string firstName, string lastName) =>
        RemoveNotLetters(firstName) + "_" + RemoveNotLetters(lastName) + new Random().Next(100);

    private static string RemoveNotLetters(string firstName) =>
        string.Concat(firstName.ToCharArray().Where(char.IsLetter));
}