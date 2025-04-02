using FluentResults;

namespace BS.Core.Errors;

public class UsernameAlreadyTakenError(string username) : Error($"Username \"{username}\" already taken.");