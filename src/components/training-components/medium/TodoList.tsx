import React, { useState } from "react";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

interface TodoListProps {
  onTodoAdd?: (todo: Todo) => void;
  onTodoToggle?: (id: string) => void;
  onTodoDelete?: (id: string) => void;
  initialTodos?: Todo[];
}

const TodoList: React.FC<TodoListProps> = ({
  onTodoAdd,
  onTodoToggle,
  onTodoDelete,
  initialTodos = [],
}) => {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: inputValue.trim(),
        completed: false,
        createdAt: new Date(),
      };

      setTodos((prev) => [...prev, newTodo]);
      setInputValue("");
      onTodoAdd?.(newTodo);
    }
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
    onTodoToggle?.(id);
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    onTodoDelete?.(id);
  };

  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case "active":
        return !todo.completed;
      case "completed":
        return todo.completed;
      default:
        return true;
    }
  });

  const getStats = () => {
    const total = todos.length;
    const completed = todos.filter((todo) => todo.completed).length;
    const active = total - completed;
    return { total, completed, active };
  };

  const stats = getStats();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  return (
    <div className="todo-list" data-testid="todo-list">
      <div className="todo-input-section">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Add a new todo..."
          data-testid="todo-input"
        />
        <button
          onClick={addTodo}
          disabled={!inputValue.trim()}
          data-testid="add-todo-button"
        >
          Add
        </button>
      </div>

      <div className="todo-filters">
        <button
          onClick={() => setFilter("all")}
          className={filter === "all" ? "active" : ""}
          data-testid="filter-all"
        >
          All ({stats.total})
        </button>
        <button
          onClick={() => setFilter("active")}
          className={filter === "active" ? "active" : ""}
          data-testid="filter-active"
        >
          Active ({stats.active})
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={filter === "completed" ? "active" : ""}
          data-testid="filter-completed"
        >
          Completed ({stats.completed})
        </button>
      </div>

      <div className="todo-items" data-testid="todo-items">
        {filteredTodos.length === 0 ? (
          <div className="no-todos" data-testid="no-todos">
            {filter === "all" ? "No todos yet!" : `No ${filter} todos`}
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={`todo-item ${todo.completed ? "completed" : ""}`}
              data-testid={`todo-item-${todo.id}`}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                data-testid={`todo-checkbox-${todo.id}`}
              />
              <span className="todo-text" data-testid={`todo-text-${todo.id}`}>
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="delete-button"
                data-testid={`delete-todo-${todo.id}`}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      <div className="todo-stats" data-testid="todo-stats">
        Total: {stats.total} | Active: {stats.active} | Completed:{" "}
        {stats.completed}
      </div>
    </div>
  );
};

export default TodoList;
