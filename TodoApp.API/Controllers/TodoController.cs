using Microsoft.AspNetCore.Mvc;
using TodoApp.Application.Services;
using TodoApp.Core.Models;

namespace TodoApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TodoController : ControllerBase
    {
        private readonly TodoService _todoService;

        public TodoController(TodoService todoService)
        {
            _todoService = todoService;
        }

        // GET: api/todo
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoItem>>> GetTodos()
        {
            var todos = await _todoService.GetAllAsync();
            return Ok(todos);
        }

        // GET: api/todo/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TodoItem>> GetTodoById(int id)
        {
            var todo = await _todoService.GetByIdAsync(id);
            if (todo == null)
                return NotFound();
            return Ok(todo);
        }

        // POST: api/todo
        [HttpPost]
        public async Task<ActionResult<TodoItem>> CreateTodoItem([FromBody] TodoItem item)
        {
            if (item == null || string.IsNullOrWhiteSpace(item.Title))
                return BadRequest("Title cannot be empty.");

            var created = await _todoService.CreateAsync(item);
            return CreatedAtAction(nameof(GetTodoById), new { id = created.Id }, created);
        }

        // PUT: api/todo/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTodoItem(int id, [FromBody] TodoItem updated)
        {
            if (updated == null)
                return BadRequest("Invalid data.");

            var success = await _todoService.UpdateAsync(id, updated);
            if (!success)
                return NotFound();

            return NoContent();
        }

        // DELETE: api/todo/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodoItem(int id)
        {
            var success = await _todoService.DeleteAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}
