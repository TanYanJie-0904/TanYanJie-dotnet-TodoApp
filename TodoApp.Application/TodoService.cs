using TodoApp.Core.Models;
using TodoApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace TodoApp.Application.Services
{
    public class TodoService
    {
        private readonly TodoDbContext _context;

        public TodoService(TodoDbContext context)
        {
            _context = context;
        }

        public async Task<List<TodoItem>> GetAllAsync()
        {
            return await _context.TodoItems.ToListAsync();
        }

        public async Task<TodoItem?> GetByIdAsync(int id)
        {
            return await _context.TodoItems.FindAsync(id);
        }

        public async Task<TodoItem> CreateAsync(TodoItem item)
        {
            _context.TodoItems.Add(item);
            await _context.SaveChangesAsync();
            return item;
        }

        public async Task<bool> UpdateAsync(int id, TodoItem updated)
        {
            var existing = await _context.TodoItems.FindAsync(id);
            if (existing == null) return false;

            existing.Title = updated.Title;
            existing.Description = updated.Description;
            existing.IsCompleted = updated.IsCompleted;
            
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _context.TodoItems.FindAsync(id);
            if (existing == null) return false;

            _context.TodoItems.Remove(existing);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
