import { render, screen, waitFor } from "@testing-library/react";
import AsyncDataFetcher from "./AsyncDataFetcher";
import userEvent from "@testing-library/user-event";

describe("AsyncDataFetcher", () => {
  test("should render loading state", () => {
    render(<AsyncDataFetcher endpoint="https://api.example.com/data" />);

    const title = screen.getByRole("heading", { name: /user data/i });
    const refreshButton = screen.getByRole("button", { name: /loading/i });

    const statusMessage = screen.getByTestId("fetcher-status");

    expect(title).toBeInTheDocument();
    expect(refreshButton).toBeInTheDocument();
    expect(statusMessage).toHaveTextContent("Loading...");
  });

  test("should render loaded data after fetch", async () => {
    const originalMathRandom = Math.random;
    Math.random = () => 0.9;

    render(<AsyncDataFetcher endpoint="https://api.example.com/data" />);

    // Wait for the loading to finish and the Refresh button to appear
    const refreshButton = await screen.findByRole("button", {
      name: /refresh/i,
    });
    expect(refreshButton).toBeInTheDocument();
    expect(refreshButton).toBeEnabled();

    // Status message should indicate loaded users
    const statusMessage = screen.getByTestId("fetcher-status");
    expect(statusMessage).toHaveTextContent(/Loaded \d+ users/);

    // Data grid should be present
    const dataGrid = screen.getByTestId("data-grid");
    expect(dataGrid).toBeInTheDocument();

    // Optionally, check that at least one user card is rendered
    const userCards = screen.getAllByTestId(/user-card-/);
    expect(userCards.length).toBeGreaterThan(0);

    // Restore Math.random
    Math.random = originalMathRandom;
  });

  test("should render error state if fetch fails", async () => {
    // Mock Math.random to always return < 0.3 (force error)
    const originalMathRandom = Math.random;
    Math.random = () => 0.1;

    render(
      <AsyncDataFetcher
        endpoint="https://api.example.com/data"
        retryAttempts={0}
      />
    );

    // Wait for the error message to appear
    const errorMessage = await screen.findByTestId("error-message");
    expect(errorMessage).toHaveTextContent(
      /Network error: Failed to fetch data/
    );

    // Status message should indicate error
    const statusMessage = screen.getByTestId("fetcher-status");
    expect(statusMessage).toHaveTextContent(/Error:/);

    // Restore Math.random
    Math.random = originalMathRandom;
  });

  test("should refresh data when Refresh button is clicked", async () => {
    const originalMathRandom = Math.random;
    Math.random = () => 0.9;

    render(<AsyncDataFetcher endpoint="https://api.example.com/data" />);

    // Wait for the data to load and Refresh button to appear
    const refreshButton = await screen.findByRole("button", {
      name: /refresh/i,
    });
    expect(refreshButton).toBeInTheDocument();
    expect(refreshButton).toBeEnabled();

    // Click the Refresh button using userEvent
    await userEvent.click(refreshButton);

    // After clicking, the button should show Loading... again
    const loadingButton = await screen.findByRole("button", {
      name: /loading/i,
    });
    expect(loadingButton).toBeInTheDocument();

    // Wait for the Refresh button to reappear (fetch complete)
    const refreshedButton = await screen.findByRole("button", {
      name: /refresh/i,
    });
    expect(refreshedButton).toBeInTheDocument();
    expect(refreshedButton).toBeEnabled();

    // Data grid should still be present
    const dataGrid = screen.getByTestId("data-grid");
    expect(dataGrid).toBeInTheDocument();

    // Restore Math.random
    Math.random = originalMathRandom;
  });

  test("shows 'No data available' when API returns empty array", async () => {
    // Save original Math.random and mockFetch
    const originalMathRandom = Math.random;
    Math.random = () => 0.9;

    // Render the component
    render(<AsyncDataFetcher endpoint="x" returnEmpty={true} />);
    // Wait for the status message
    const statusMessage = await screen.findByTestId("fetcher-status");

    await waitFor(() => {
      expect(statusMessage).toHaveTextContent("No data available");
    });

    // Restore
    Math.random = originalMathRandom;
  });
});
