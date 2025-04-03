namespace BS.Data.Options;

public class ConnectionStringsOptions
{
    public const string Section = nameof(ConnectionStringsOptions);

    public required string Postgres { get; set; }
}