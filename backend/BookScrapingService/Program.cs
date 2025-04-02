using System.Text.RegularExpressions;

namespace BookScrapingService;

static partial class Program
{
    private const string FileName = "book_titles.txt";
    private const string BookNamesFromTxtFile = @"^\d+\.\s*(.*)$";

    static async Task Main(string[] args)
    {
        var bookNames= ParseBookNamesFromFile();
        var books = await BookScraper.GetBookInfos(bookNames);
        foreach (var bookInfo in books)
        {
            Console.WriteLine(bookInfo);
        }
        
        Console.WriteLine($"Total count: {books.Count}.");
    }

    private static string[] ParseBookNamesFromFile()
    {
        var bookNames = new List<string>();
        var fullPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, FileName);
        if (File.Exists(fullPath))
        {
            try
            {
                var lines = File.ReadAllLines(fullPath);

                foreach (var line in lines)
                {
                    var match = BookNamesFromTxtFileRegex().Match(line.Trim());

                    if (match.Success)
                    {
                        bookNames.Add(match.Groups[1].Value);
                    }
                }

                return bookNames.ToArray();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error reading the file: {ex.Message}");
            }
        }
        else
        {
            Console.WriteLine($"The file {fullPath} does not exist.");
        }

        return [];
    }

    static List<string> GenerateISBNList(int count)
    {
        var isbnList = new List<string>();
        var rand = new Random();

        for (var i = 0; i < count; i++)
        {
            // Generate ISBN-13
            var isbn = GenerateISBN13(rand);
            isbnList.Add(isbn);
        }

        return isbnList;
    }

    static string GenerateISBN13(Random rand)
    {
        // Belarus 978 - 985
        
        var prefix = "978"; 

        // Generate the next 9 digits (group, publisher, and title)
        var group = "9";
        var publisher = "85" + rand.Next(1, 10); // Random publisher (3 digits)
        var title = rand.Next(1000, 10000).ToString("D4"); // Random title code (4 digits)

        // Concatenate the parts: "978" + group + publisher + title
        var isbnBase = prefix + group + publisher + title;

        // Calculate the checksum (last digit) using the ISBN-13 algorithm
        var checksum = CalculateISBN13Checksum(isbnBase);

        // Return the full ISBN-13 number
        return isbnBase + checksum;
    }

    static int CalculateISBN13Checksum(string isbnBase)
    {
        var sum = 0;
        for (var i = 0; i < isbnBase.Length; i++)
        {
            var digit = int.Parse(isbnBase[i].ToString());
            // Alternate weights of 1 and 3
            sum += (i % 2 == 0) ? digit : digit * 3;
        }

        var remainder = sum % 10;
        return (10 - remainder) % 10;
    }

    [GeneratedRegex(BookNamesFromTxtFile)]
    private static partial Regex BookNamesFromTxtFileRegex();
}