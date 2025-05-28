using BS.Core.Models.User;

namespace BS.Core.Models.Queue;

public class ItemModel
{
    public Guid ItemId { get; set; }
    public required QueueUserModel[] Queue { get; set; } // order is important! That's the queue order
    public required UserProfile Owner { get; set; }
    public required UserProfile Holder { get; set; }
    public UserProfile? FirstInQueue { get; set; }
}