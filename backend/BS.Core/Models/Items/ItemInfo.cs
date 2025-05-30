using BS.Core.Models.Book;

namespace BS.Core.Models.Items;

public class ItemInfo
{
    public required Guid ItemId { get; set; }
    public required BookModel Book { get; set; }
    public required UserInTextProfile Owner { get; set; }
    public required UserInTextProfile Holder { get; set; }
    public required UserInTextProfile? FirstInQueue { get; set; }
    public required int? QueuePosition { get; set; }
    public required int HolderChangedDaysAgo { get; set; }
}