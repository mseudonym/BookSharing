using BookScrapingService;
using FluentAssertions;

namespace Tests;

public class Tests
{
    [SetUp]
    public void Setup()
    {
    }

    [Test]
    public void Test_Equality()
    {
        var b1 = new BookInfo
        {
            Author = "auth",
            BookCoverId = "cover.jpg",
            Description = "blablabla...",
            ISBN = "1234567891",
            Title = "title",
        };
        var b2 = new BookInfo
        {
            Author = "auth",
            BookCoverId = "cover.jpg",
            Description = "blablabla...",
            ISBN = "1234567891",
            Title = "title",
        };

        b1.Equals(b2).Should().BeTrue();
    }

    [Test]
    public void Test_Inequality()
    {
        var b1 = new BookInfo
        {
            Author = "auth",
            BookCoverId = "cover.jpg",
            Description = "blablabla...",
            ISBN = "1234567891",
            Title = "title",
        };
        var b2 = new BookInfo
        {
            Author = "auth",
            BookCoverId = "cover.jpg",
            Description = "blablabla...",
            ISBN = "1234567892",
            Title = "title",
        };

        b1.Equals(b2).Should().BeFalse();
    }

    [Test]
    public async Task Test_NotFound()
    {
        var res = await BookScraper.GetBookInfoOrNullAsync("ййй");
        res.Should().BeNull();
    }

    [Test]
    public async Task Test_GetAllBooks()
    {
        var booksArray = new[]
        {
            "мастер и маргарита",
            "война и мир",
            "преступление и наказание"
        };

        var res = await BookScraper.GetBookInfos(booksArray);
        res.Should().NotBeNull();

        res.Should().Contain(new BookInfo
        {
            Author = "Михаил Булгаков",
            Title = "Мастер и Маргарита",
            Description = "«Мастер и Маргарита» — это роман, который стоит особняком от остальных книг, " +
                          "изданных в советский период. Параллельно в книге развиваются несколько сюжетных линий, " +
                          "а реальное смешивается с фантастическим и мистическим. Книга предлагает нам исследовать " +
                          "разные временные периоды, а также забраться в...",
            BookCoverId = "book_covers/c7/b1/c7b1406c-d5a1-4762-b37a-67b25bdaca8a.jpg",
            ISBN = "9785699453511"
        });

        res.Should().Contain(new BookInfo
        {
            Author = "Лев Толстой",
            Title = "Война и мир. Книга 1",
            Description = "В книгу вошли первый и второй тома романа «Война и мир» – " +
                          "одного из самых знаменитых произведений литературы XIX века.",
            BookCoverId = "book_covers/bd/f0/bdf0757e-f4bd-431d-831a-ab2416122024.jpg",
            ISBN = "5170064004"
        });

        res.Should().Contain(new BookInfo
        {
            Author = "Федор Достоевский",
            Title = "Преступление и наказание",
            Description = "«Преступление и наказание» — классический психологический роман, написанный Достоевским " +
                          "с характерным для автора глубоким философским подтекстом. Книга входит в школьную " +
                          "программу по литературе — однако понять произведение во всем его величии, будучи " +
                          "школьником, очень сложно. Именно поэтому стоит...",
            BookCoverId = "book_covers/e4/9d/e49d2390-d67c-4f75-ac92-3a8afc278815.jpg",
            ISBN = "9785170438556"
        });
    }

    [Test]
    public async Task Test_GetOneBook()
    {
        var res = await BookScraper.GetBookInfoOrNullAsync("мастер и маргарита");
        res.Author.Should().Be("Михаил Булгаков");
        res.Title.Should().Be("Мастер и Маргарита");
        res.Description.Should().Contain("Мастер и Маргарита");
        res.BookCoverId.Should().Be("book_covers/c7/b1/c7b1406c-d5a1-4762-b37a-67b25bdaca8a.jpg");
        res.ISBN.Should().Be("9785699453511");
    }

    [TestCase("мастер и маргарит")]
    public async Task Test_GetOneBook_TypoInBookTitle(string titleWithTypo)
    {
        var res = await BookScraper.GetBookInfoOrNullAsync(titleWithTypo);
        res.Author.Should().Be("Михаил Булгаков");
        res.Title.Should().Be("Мастер и Маргарита");
        res.Description.Should().Contain("Мастер и Маргарита");
        res.BookCoverId.Should().Be("book_covers/c7/b1/c7b1406c-d5a1-4762-b37a-67b25bdaca8a.jpg");
        res.ISBN.Should().Be("9785699453511");
    }

    [TestCase("bfvbekfvee")]
    [TestCase("иывсолиумдиулдмп")]
    public async Task Test_GetOneBook_InvalidInput(string invalidInput)
    {
        var res = await BookScraper.GetBookInfoOrNullAsync(invalidInput);
        res.Should().BeNull();
    }


    [TestCase("")]
    [TestCase(" ")]
    [TestCase("        ")]
    public async Task Test_GetOneBook_EmptyInput_ShouldReturnPopularBook(string emptyInput)
    {
        var res = await BookScraper.GetBookInfoOrNullAsync(emptyInput);
        res.Should().NotBeNull();
        res.Author.Should().NotBeNull();
        res.Title.Should().NotBeNull();
        res.Description.Should().NotBeNull();
        res.BookCoverId.Should().NotBeNull();
        res.ISBN.Should().NotBeNull();
    }

    [TestCase("б")]
    [TestCase("д")]
    [TestCase("s")]
    [TestCase("m")]
    public async Task Test_GetOneBook_RequestIsTooShort(string shortRequest)
    {
        var res = await BookScraper.GetBookInfoOrNullAsync(shortRequest);
        res.Should().BeNull();
    }
}