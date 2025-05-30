namespace BS.Api.Requests;

public class ChangePasswordRequest
{
    public string? NewPassword { get; init; }

    public string? OldPassword { get; init; }
}