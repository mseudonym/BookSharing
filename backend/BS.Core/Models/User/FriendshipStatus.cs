using System.Text.Json.Serialization;

namespace BS.Core.Models.User;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum FriendshipStatus
{
    Friend = 0,
    IncomeRequest = 1,
    OutcomeRequest = 2,
    None = 3,
}