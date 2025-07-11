import TodoList from "./TodoList";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("TodoList", () => {
  const initialTodos = [
    { id: "1", text: "Buy groceries", completed: false, createdAt: new Date() },
    {
      id: "2",
      text: "Farm gamer moments",
      completed: true,
      createdAt: new Date(),
    },
  ];

  describe("Displays correctly", () => {
    test("should render no props", () => {
      render(<TodoList />);

      const todoInput = screen.getByPlaceholderText("Add a new todo...");
      expect(todoInput).toBeInTheDocument();

      const addTodoButton = screen.getByRole("button", { name: /add/i });
      expect(addTodoButton).toBeInTheDocument();

      // Filters
      const filterAllButton = screen.getByRole("button", { name: /all/i });
      expect(filterAllButton).toBeInTheDocument();
      const filterActiveButton = screen.getByRole("button", {
        name: /active/i,
      });
      expect(filterActiveButton).toBeInTheDocument();
      const filterCompletedButton = screen.getByRole("button", {
        name: /completed/i,
      });
      expect(filterCompletedButton).toBeInTheDocument();

      // Items
      const noTodos = screen.getByTestId("no-todos");
      expect(noTodos).toHaveTextContent("No todos yet!");

      // Stats
      const stats = screen.getByTestId("todo-stats");
      expect(stats).toHaveTextContent("Total: 0 | Active: 0 | Completed: 0");
    });

    test("should render with initial todos", () => {
      render(<TodoList initialTodos={initialTodos} />);

      const itemsList = screen.getByTestId("todo-items");
      expect(itemsList).toBeInTheDocument();

      for (const todo of initialTodos) {
        const todoItem = screen.getByTestId(`todo-item-${todo.id}`);
        expect(todoItem).toBeInTheDocument();

        // Check for checkbox inside todoItem
        const checkbox = within(todoItem).getByRole("checkbox");
        expect(checkbox).toBeInTheDocument();
        if (todo.completed) {
          expect(checkbox).toBeChecked();
          expect(todoItem).toHaveClass("completed");
        } else {
          expect(todoItem).not.toHaveClass("completed");
          expect(checkbox).not.toBeChecked();
        }

        // Check for text inside todoItem
        const text = within(todoItem).getByText(todo.text);
        expect(text).toBeInTheDocument();
        expect(text).toHaveTextContent(todo.text);

        // Check for delete button inside todoItem
        const deleteButton = within(todoItem).getByRole("button");
        expect(deleteButton).toBeInTheDocument();
        expect(deleteButton).toHaveTextContent("×");
      }
    });

    test("should say if there are no todos with filter", async () => {
      const user = userEvent.setup();
      render(<TodoList initialTodos={initialTodos.slice(0, 1)} />);

      const filterCompletedButton = screen.getByRole("button", {
        name: /completed/i,
      });

      await user.click(filterCompletedButton);

      const noTodos = screen.getByTestId("no-todos");
      expect(noTodos).toHaveTextContent("No completed todos");
    });

    test("should show the correct number of todos with filter", async () => {
      const user = userEvent.setup();
      render(<TodoList initialTodos={initialTodos} />);

      const filterCompletedButton = screen.getByRole("button", {
        name: /completed/i,
      });
      await user.click(filterCompletedButton);

      const todoItems = screen.getAllByTestId(/^todo-item-\d+$/);
      expect(todoItems).toHaveLength(1);
      expect(todoItems[0]).toHaveTextContent(initialTodos[1].text);
      expect(todoItems[0]).toHaveClass("completed");
    });
  });

  describe("Functions correctly", () => {
    test("should add a todo", async () => {
      const user = userEvent.setup();
      const onTodoAdd = jest.fn();
      render(<TodoList onTodoAdd={onTodoAdd} />);

      const noTodos = screen.getByTestId("no-todos");
      const stats = screen.getByTestId("todo-stats");
      expect(noTodos).toHaveTextContent("No todos yet!");
      expect(stats).toHaveTextContent("Total: 0 | Active: 0 | Completed: 0");

      const todoInput = screen.getByPlaceholderText("Add a new todo...");
      const addTodoButton = screen.getByRole("button", { name: /add/i });

      await user.type(todoInput, "Buy groceries");
      await user.click(addTodoButton);

      const todoItems = screen.getAllByTestId(/^todo-item-\d+$/);
      expect(todoItems).toHaveLength(1);
      expect(todoItems[0]).toHaveTextContent("Buy groceries");
      expect(todoItems[0]).not.toHaveClass("completed");

      expect(onTodoAdd).toHaveBeenCalledWith({
        id: expect.any(String),
        text: "Buy groceries",
        completed: false,
        createdAt: expect.any(Date),
      });

      expect(todoInput).toHaveValue("");
      expect(stats).toHaveTextContent("Total: 1 | Active: 1 | Completed: 0");
    });

    test("should not add empty or whitespace-only todos", async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText("Add a new todo...");
      const addButton = screen.getByRole("button", { name: /add/i });

      // Test empty input
      expect(addButton).toBeDisabled();

      // Test whitespace only
      await user.type(input, "   ");
      expect(addButton).toBeDisabled();

      await user.click(addButton);
      expect(screen.getByTestId("no-todos")).toBeInTheDocument();
    });

    test("should add todo on Enter key press", async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByPlaceholderText("Add a new todo...");
      await user.type(input, "New todo{enter}");

      expect(screen.getByText("New todo")).toBeInTheDocument();
      expect(input).toHaveValue(""); // Should clear after adding
    });

    test("should toggle a todo", async () => {
      const user = userEvent.setup();
      const onTodoToggle = jest.fn();
      render(
        <TodoList initialTodos={initialTodos} onTodoToggle={onTodoToggle} />
      );

      const stats = screen.getByTestId("todo-stats");
      expect(stats).toHaveTextContent("Total: 2 | Active: 1 | Completed: 1");

      const todoItems = screen.getAllByTestId(/^todo-item-\d+$/);
      expect(todoItems).toHaveLength(2);
      expect(todoItems[0]).toHaveTextContent(initialTodos[0].text);
      expect(todoItems[0]).not.toHaveClass("completed");

      const checkbox = within(todoItems[0]).getByRole("checkbox");
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox!);

      expect(checkbox).toBeChecked();
      expect(todoItems[0]).toHaveClass("completed");

      expect(onTodoToggle).toHaveBeenCalledWith(initialTodos[0].id);

      const updatedStats = screen.getByTestId("todo-stats");
      expect(updatedStats).toHaveTextContent(
        "Total: 2 | Active: 0 | Completed: 2"
      );
    });

    test("should delete a todo", async () => {
      const user = userEvent.setup();
      const onTodoDelete = jest.fn();
      render(
        <TodoList initialTodos={initialTodos} onTodoDelete={onTodoDelete} />
      );

      const stats = screen.getByTestId("todo-stats");
      expect(stats).toHaveTextContent("Total: 2 | Active: 1 | Completed: 1");

      const todoItems = screen.getAllByTestId(/^todo-item-\d+$/);
      expect(todoItems).toHaveLength(2);

      const deleteButton = within(todoItems[0]).getByRole("button");
      expect(deleteButton).toBeInTheDocument();

      await user.click(deleteButton!);

      const updatedTodoItems = screen.getAllByTestId(/^todo-item-\d+$/);
      expect(updatedTodoItems).toHaveLength(1);

      expect(onTodoDelete).toHaveBeenCalledWith(initialTodos[0].id);

      expect(stats).toHaveTextContent("Total: 1 | Active: 0 | Completed: 1");
    });
  });
});
