using BS.Core.Models.Book;

namespace BS.Core.Models.Items;

public class MyItemInfo
{
    public Guid ItemId { get; set; }
    public BookModel? Book { get; set; }
    public Guid CurrentHolderId { get; set; }
    public string? CurrentHolderContact { get; set; }
}