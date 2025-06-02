using FluentResults;

namespace BS.Core.Errors;

public class PersonIsNotYourFriendError(Guid id) : Error($"Person with id: {id} is not your friend");