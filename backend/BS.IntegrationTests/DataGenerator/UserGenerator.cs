using System.Data;
using Bogus;
using BS.Core.Models.User;
using BS.Data.Validations;
using BS.IntegrationTests.Extensions;

namespace BS.IntegrationTests.DataGenerator;

public static partial class DataGenerator
{
    public static EditProfileModel GenerateEditProfileModel()
    {
        var faker = new Faker<EditProfileModel>()
            .RuleFor(p => p.FirstName, (f, _) => f.Name.FirstName())
            .RuleFor(p => p.LastName, (f, _) => f.Name.LastName())
            .RuleFor(p => p.Username, (f, p) =>
            {
                var userName = f.Name.UserName(p.FirstName!, p.LastName!);

                return userName[..Math.Min(userName.Length, DataUserValidationConstants.UsernameMaxLength)];
            })
            .RuleFor(p => p.ContactUrl, (_, p) => $"https://t.me/{p.Username}");

        return faker.Generate();
    }

    public static string GenerateRandomUsernamePrefix(int length = 5)
    {
        var faker = new Faker();
        return faker.Random.String2(length);
    }
}