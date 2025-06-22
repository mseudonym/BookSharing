namespace BS.Data.Entities.Base;

public interface ISoftDeletable
{
    bool IsDeleted { get; set; }
}