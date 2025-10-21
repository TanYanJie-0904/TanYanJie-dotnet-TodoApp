import React, { useState, useEffect } from "react";
import { getTodos, addTodo, updateTodo, deleteTodo } from "./api";

function App() {
  const [todos, setTodos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // 加载todos
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    setIsLoading(true);
    try {
      const data = await getTodos();
      setTodos(data);
    } catch (error) {
      console.error("Failed to load todos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 切换任务完成状态
  const toggleTodo = async (todo) => {
    try {
      const updated = { ...todo, isCompleted: !todo.isCompleted };
      await updateTodo(todo.id, updated);
      setTodos(todos.map((t) => 
        t.id === todo.id ? { ...t, isCompleted: !t.isCompleted } : t
      ));
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  // 打开编辑模态框
  const openEditModal = (todo) => {
    setEditingTodo(todo);
    setNewTitle(todo.title);
    setNewDescription(todo.description || "");
    setIsModalOpen(true);
  };

  // 关闭模态框并重置
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTodo(null);
    setNewTitle("");
    setNewDescription("");
  };

  // 添加或更新任务
  const handleSaveTodo = async () => {
    if (!newTitle.trim()) return;

    const todoData = {
      title: newTitle,
      description: newDescription,
      isCompleted: editingTodo ? editingTodo.isCompleted : false,
    };

    try {
      if (editingTodo) {
        // 更新现有任务
        await updateTodo(editingTodo.id, { ...todoData, id: editingTodo.id });
        setTodos(todos.map((t) => 
          t.id === editingTodo.id ? { ...t, ...todoData } : t
        ));
      } else {
        // 添加新任务
        const created = await addTodo(todoData);
        setTodos([...todos, created]);
      }
      closeModal();
    } catch (error) {
      console.error("Failed to save todo:", error);
    }
  };

  // 删除任务
  const handleDeleteTodo = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }
    
    try {
      await deleteTodo(id);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  // 计算统计
  const totalTasks = todos.length;

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#f5f5f5", 
      padding: "2rem" 
    }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "2rem" 
        }}>
          <h1 style={{ 
            fontSize: "2rem", 
            fontWeight: "bold",
            margin: 0 
          }}>
            Task List 
            <span style={{ 
              color: "#999", 
              fontSize: "1.2rem", 
              marginLeft: "0.5rem" 
            }}>
              (Total: {totalTasks})
            </span>
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              backgroundColor: "#4a5568",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#2d3748"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "#4a5568"}
          >
            + New Task
          </button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div style={{ 
            textAlign: "center", 
            padding: "3rem", 
            color: "#999",
            fontSize: "1.1rem"
          }}>
            Loading tasks...
          </div>
        ) : todos.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            padding: "3rem", 
            backgroundColor: "white",
            borderRadius: "12px",
            color: "#999",
            fontSize: "1.1rem"
          }}>
            No tasks yet. Click "+ New Task" to get started!
          </div>
        ) : (
          /* Task List */
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {todos.map((todo) => (
              <div
                key={todo.id}
                style={{
                  backgroundColor: todo.isCompleted ? "#e8e8e8" : "white",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1.5rem",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s",
                }}
              >
                {/* Status Badge */}
                <div
                  style={{
                    backgroundColor: todo.isCompleted ? "#d4d4d4" : "white",
                    border: "2px solid #d4d4d4",
                    borderRadius: "8px",
                    padding: "0.75rem 1.25rem",
                    minWidth: "90px",
                    textAlign: "center",
                    color: "#666",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                  }}
                >
                  {todo.isCompleted ? "Complete" : "Pending"}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    margin: "0 0 0.5rem 0", 
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    color: "#1a1a1a"
                  }}>
                    {todo.title}
                  </h3>
                  {todo.description && (
                    <p style={{ 
                      margin: 0, 
                      color: "#666",
                      fontSize: "0.95rem"
                    }}>
                      {todo.description}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {!todo.isCompleted && (
                    <button
                      onClick={() => toggleTodo(todo)}
                      style={{
                        backgroundColor: "#10b981",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        padding: "0.625rem 1.25rem",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                        whiteSpace: "nowrap",
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = "#059669"}
                      onMouseLeave={(e) => e.target.style.backgroundColor = "#10b981"}
                    >
                      ✓ Complete
                    </button>
                  )}
                  <button
                    onClick={() => openEditModal(todo)}
                    style={{
                      backgroundColor: "#3b82f6",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "0.625rem 1.25rem",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#2563eb"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "#3b82f6"}
                  >
                    ✎ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    style={{
                      backgroundColor: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "0.625rem 1.25rem",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#dc2626"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "#ef4444"}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={closeModal}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "2.5rem",
              width: "90%",
              maxWidth: "500px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ 
              margin: "0 0 2rem 0", 
              fontSize: "1.75rem",
              fontWeight: "bold",
              textAlign: "center"
            }}>
              {editingTodo ? "Edit Task" : "New Task"}
            </h2>

            <input
              type="text"
              placeholder="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "1rem",
                marginBottom: "1.5rem",
                border: "none",
                backgroundColor: "#f0f0f0",
                borderRadius: "8px",
                fontSize: "1rem",
                boxSizing: "border-box",
              }}
            />

            <textarea
              placeholder="Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={4}
              style={{
                width: "100%",
                padding: "1rem",
                marginBottom: "2rem",
                border: "none",
                backgroundColor: "#f0f0f0",
                borderRadius: "8px",
                fontSize: "1rem",
                resize: "vertical",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />

            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={closeModal}
                style={{
                  flex: 1,
                  backgroundColor: "#e5e7eb",
                  color: "#374151",
                  border: "none",
                  borderRadius: "8px",
                  padding: "1rem",
                  fontSize: "1rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#d1d5db"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#e5e7eb"}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTodo}
                style={{
                  flex: 1,
                  backgroundColor: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "1rem",
                  fontSize: "1rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#2563eb"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#3b82f6"}
              >
                {editingTodo ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;