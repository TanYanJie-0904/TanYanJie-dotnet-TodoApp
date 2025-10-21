using Microsoft.EntityFrameworkCore;
using TodoApp.Infrastructure.Data;
using TodoApp.Application.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS policy (for React app)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy
            .WithOrigins("http://localhost:3000") // React 默认端口
            .AllowAnyHeader()
            .AllowAnyMethod());
});

builder.Services.AddDbContext<TodoDbContext>(options =>
    options.UseSqlite("Data Source=todo.db"));

builder.Services.AddScoped<TodoService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Enable CORS before Authorization
app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

app.Run();
