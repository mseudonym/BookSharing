using System.Net;

namespace BS.IntegrationTests.Helpers;

public static class AssertionHelper
{
    public static void AssertReturnCode(
        HttpStatusCode expectedStatusCode,
        Task methodCall)
    {
        Assert.ThrowsAsync(
            Is.TypeOf<HttpRequestException>()
                .And.Property("StatusCode")
                .EqualTo(expectedStatusCode),
            async () => await methodCall
        );
    }
}