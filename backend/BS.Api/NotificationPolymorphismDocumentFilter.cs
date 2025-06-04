using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using BS.Core.Models.Notifications.Items;
using BS.Core.Models.Notifications.FriendUpdate;
using BS.Core.Models.Notifications.Friendship;

namespace BS.Api;

public class NotificationPolymorphismDocumentFilter : IDocumentFilter
{
    public void Apply(OpenApiDocument swaggerDoc, DocumentFilterContext context)
    {
        // Регистрируем все наследники
        var derivedTypes = new[]
        {
            typeof(SomeoneBecameHolderOfYourItemNotification),
            typeof(SomeoneQueueToItemNotification),
            typeof(YourQueuePositionChangedNotification),
            typeof(FriendTakeBookToReadNotification),
            typeof(NewBooksInFriendShelfNotification),
            typeof(FriendshipStatusChangedNotification)
        };
        foreach (var type in derivedTypes)
            context.SchemaGenerator.GenerateSchema(type, context.SchemaRepository);

        // Добавляем discriminator и oneOf вручную
        // var baseTypeName = nameof(NotificationBase);
        // if (context.SchemaRepository.Schemas.TryGetValue(baseTypeName, out var baseSchema))
        // {
        //     baseSchema.Discriminator = new OpenApiDiscriminator
        //     {
        //         PropertyName = "$type",
        //         Mapping = derivedTypes.ToDictionary(
        //             t => t.Name,
        //             t => $"#/components/schemas/{t.Name}")
        //     };
        //     baseSchema.OneOf = derivedTypes
        //         .Select(t => new OpenApiSchema { Reference = new OpenApiReference { Type = ReferenceType.Schema, Id = t.Name } })
        //         .ToList();
        // }
    }
} 