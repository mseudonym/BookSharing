using BS.Core;
using BS.Core.Services.Book;
using BS.Core.Services.User;
using BS.Data;
using BS.WebScraper;

var builder = WebApplication.CreateBuilder(args);

// Добавляем службы для контроллеров
builder.Services.AddControllers();

// Добавляем Swagger для документирования API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddBsDbContext(builder.Configuration);
builder.Services.AddBsServices(builder.Configuration);

builder.Services.AddScoped<ICurrentUserService, EmptyUserService>();
builder.Services.AddS3Client(builder.Configuration);
builder.Services.AddScoped<IBookService, BookService>();

var app = builder.Build();

// Включаем Swagger, если приложение работает в режиме разработки
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Включаем использование маршрутов контроллеров
app.MapControllers();

app.Run();