using BS.Core.Models.Book;

namespace BS.Core.Models.Items;

public class FriendItemInfo
{
    public Guid ItemId { get; set; }
    public required BookModel Book { get; set; } 
    public bool AmIHolder { get; set; }
    public Guid OwnerId { get; set; }
    public string? HolderContact { get; set; }
    public string? HolderUsername { get; set; }
    public string? WhoToGiveAfterContact { get; set; }
    public string? WhoToGiveAfterUserName { get; set; }
    public int QueueNumber { get; set; }
}