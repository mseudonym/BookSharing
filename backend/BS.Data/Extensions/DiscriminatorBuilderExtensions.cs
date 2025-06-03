using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BS.Data.Extensions;

public static class DiscriminatorBuilderExtensions
{
    public static DiscriminatorBuilder<string> HasValueByTypeName<T>(this DiscriminatorBuilder<string> builder)
    {
        return builder.HasValue<T>(typeof(T).Name);
    }
}