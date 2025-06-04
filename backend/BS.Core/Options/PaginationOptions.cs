namespace BS.Core.Options;

public class PaginationOptions
{
    public const string Section = nameof(PaginationOptions);

    public int MaxPageSize { get; set; }
}