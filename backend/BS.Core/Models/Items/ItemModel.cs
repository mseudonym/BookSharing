using BS.Core.Models.User;

namespace BS.Core.Models.Items;

public class ItemModel
{
    public Guid ItemId { get; set; }
    public required QueueUserModel[] Queue { get; set; }
    public required UserProfile Owner { get; set; }
    public required UserProfile Holder { get; set; }
    public UserProfile? FirstInQueue { get; set; }
}