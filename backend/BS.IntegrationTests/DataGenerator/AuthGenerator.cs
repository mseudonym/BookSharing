using Bogus;
using Microsoft.AspNetCore.Identity.Data;

namespace BS.IntegrationTests.DataGenerator;

public static partial class DataGenerator
{
    public static RegisterRequest GenerateRegisterRequest()
    {
        var faker = new Faker<RegisterRequest>()
            .RuleFor(p => p.Email, (f, _) => f.Internet.Email())
            .RuleFor(p => p.Password, (f, _) => f.Internet.Password(20, prefix: "aA1_"));

        return faker.Generate();
    }
}