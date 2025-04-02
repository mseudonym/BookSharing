using BS.Core.Models.User;

namespace BS.Core.Models.Queue;

public class QueueModel
{
    public Guid ItemId { get; set; }
    public List<QueueUser?>? Queue { get; set; } // order is important! That's the queue order
    public UserProfile? Owner { get; set; }
    public UserProfile? Holder { get; set; }
}