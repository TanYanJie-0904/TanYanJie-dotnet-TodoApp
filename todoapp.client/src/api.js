const API_URL = "http://localhost:5276/api/Todo"; 

export async function getTodos() {
  const res = await fetch(API_URL);
  return res.ok ? await res.json() : [];
}

export async function addTodo(item) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  return await res.json();
}

export async function updateTodo(id, item) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error(`Failed to update todo: ${res.status}`);
}


export async function deleteTodo(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Failed to delete todo: ${res.status}`);
}
