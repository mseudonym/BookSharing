namespace BS.Api.Requests;

public class EditProfileRequest
{
    public string? FirstName { get; set; }
    
    public string? LastName { get; set; }
    public string? Username { get; set; }
    
    public string? ContactUrl { get; set; }
    
    public IFormFile? PhotoFile { get; set; }
}