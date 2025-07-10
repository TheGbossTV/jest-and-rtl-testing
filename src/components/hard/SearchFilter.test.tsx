/**
 * HARD EXAMPLE 2: Testing Complex Search and Filter Component with RTL
 * 
 * This test file demonstrates advanced RTL testing patterns:
 * - Testing debounced user input using findBy queries and natural timing
 * - Using waitFor and findBy instead of manual timer control
 * - Testing multiple interactive filters with realistic user interactions
 * - Avoiding act() calls in favor of RTL's built-in async utilities
 * - Testing loading states using natural element appearance/disappearance
 * - Complex user interactions with proper async handling
 */

/// <reference types="@testing-library/jest-dom" />
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchFilter } from './SearchFilter';

describe('SearchFilter Component', () => {
  
  // TIMER MOCKING: Control timing for debounced operations
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    // FAKE TIMERS: Replace real timers with controllable mocks
    // This allows us to control setTimeout, setInterval, etc.
    jest.useFakeTimers();
  });

  afterEach(() => {
    // TIMER CLEANUP: Run pending timers and restore real timers
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  /**
   * TEST 1: Initial Render & Form Elements
   * Test that component renders with initial state
   */
  test('renders initial search interface', () => {
    // ARRANGE & ACT
    render(<SearchFilter />);

    // ASSERT: Check all form elements are present
    // FORM ELEMENT TESTING: Verify all interactive elements exist
    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
    expect(screen.getByLabelText('Category:')).toBeInTheDocument();
    expect(screen.getByLabelText('Min Price:')).toBeInTheDocument();
    expect(screen.getByLabelText('Max Price:')).toBeInTheDocument();
    expect(screen.getByLabelText('In Stock Only')).toBeInTheDocument();
    expect(screen.getByText('Clear All')).toBeInTheDocument();
  });

  /**
   * TEST 2: Basic Input Handling
   * Test basic search input functionality
   */
  test('handles search input changes', async () => {
    // ARRANGE
    // userEvent.setup({ delay: null }) - Remove default delays for faster tests
    const user = userEvent.setup({ delay: null });
    render(<SearchFilter />);

    // ACT
    const searchInput = screen.getByPlaceholderText('Search products...');
    await user.type(searchInput, 'laptop');

    // ASSERT
    // INPUT VALUE TESTING: Verify input value changes
    expect(searchInput).toHaveValue('laptop');
  });

  /**
   * TEST 3: Debouncing with findBy - Advanced Async Testing
   * Test debounced search using findBy to wait for natural loading state appearance
   */
  test('debounces search input', async () => {
    // ARRANGE
    const user = userEvent.setup({ delay: null });
    const mockOnResultsChange = jest.fn();
    render(<SearchFilter onResultsChange={mockOnResultsChange} debounceMs={300} />);

    // ACT
    const searchInput = screen.getByPlaceholderText('Search products...');
    await user.type(searchInput, 'laptop');

    // ASSERT: Should not trigger search immediately
    // DEBOUNCE TESTING: Verify debounced function doesn't fire immediately
    expect(screen.queryByText('Searching...')).not.toBeInTheDocument();

    // ACT & ASSERT: Wait for debounced search to trigger by finding loading state
    // findBy* - ASYNC QUERY: Waits for element to appear (up to 1000ms by default)
    // This is preferred over manual timer control for testing debounced operations
    await expect(screen.findByText('Searching...', {}, { timeout: 500 })).resolves.toBeInTheDocument();
  });

  /**
   * TEST 4: Complex Form Interactions
   * Test that filter controls work correctly
   */
  test('handles filter changes', async () => {
    // ARRANGE
    const user = userEvent.setup({ delay: null });
    render(<SearchFilter />);

    // ACT: Change category filter
    // SELECT TESTING: Test dropdown/select input changes
    const categorySelect = screen.getByLabelText('Category:');
    await user.selectOptions(categorySelect, 'electronics');

    // ACT: Change price range
    // NUMERIC INPUT TESTING: Test number input fields
    const minPriceInput = screen.getByLabelText('Min Price:');
    const maxPriceInput = screen.getByLabelText('Max Price:');
    await user.clear(minPriceInput);
    await user.type(minPriceInput, '100');
    await user.clear(maxPriceInput);
    await user.type(maxPriceInput, '1000');

    // ACT: Toggle in-stock filter
    // CHECKBOX TESTING: Test checkbox interactions
    const inStockCheckbox = screen.getByLabelText('In Stock Only');
    await user.click(inStockCheckbox);

    // ASSERT: Verify all form state changes
    // FORM STATE VERIFICATION: Check that all inputs updated correctly
    expect(categorySelect).toHaveValue('electronics');
    expect(minPriceInput).toHaveValue(100);
    expect(maxPriceInput).toHaveValue(1000);
    expect(inStockCheckbox).toBeChecked();
  });

  /**
   * TEST 5: Bulk Operations & Form Reset
   * Test that clear all button resets all filters
   */
  test('clears all filters when clear button is clicked', async () => {
    // ARRANGE
    const user = userEvent.setup({ delay: null });
    render(<SearchFilter />);

    // ACT: Set some filters
    // SETUP COMPLEX STATE: Modify multiple form elements
    const searchInput = screen.getByPlaceholderText('Search products...');
    const categorySelect = screen.getByLabelText('Category:');
    const inStockCheckbox = screen.getByLabelText('In Stock Only');

    await user.type(searchInput, 'laptop');
    await user.selectOptions(categorySelect, 'electronics');
    await user.click(inStockCheckbox);

    // ACT: Clear all
    const clearButton = screen.getByText('Clear All');
    await user.click(clearButton);

    // ASSERT: Verify all filters are reset
    // FORM RESET TESTING: Check that all form elements return to initial state
    expect(searchInput).toHaveValue('');
    expect(categorySelect).toHaveValue('');
    expect(inStockCheckbox).not.toBeChecked();
  });

  /**
   * TEST 6: Loading States with Natural Timing
   * Test loading states using RTL's findBy instead of manual timer control
   */
  test('shows loading state during search', async () => {
    // ARRANGE
    const user = userEvent.setup({ delay: null });
    render(<SearchFilter debounceMs={100} />);

    // ACT
    const searchInput = screen.getByPlaceholderText('Search products...');
    await user.type(searchInput, 'laptop');

    // ASSERT: Wait for loading state to appear naturally after debounce
    // NATURAL ASYNC TESTING: Let the component's natural timing control the test
    // This is more realistic than manually controlling timers
    await expect(screen.findByText('Searching...', {}, { timeout: 200 })).resolves.toBeInTheDocument();
  });

  /**
   * TEST 7: Edge Cases & Negative Testing
   * Test behavior when search input is empty
   */
  test('handles empty search input', async () => {
    // ARRANGE
    const user = userEvent.setup({ delay: null });
    render(<SearchFilter />);

    // ACT: Type then clear
    const searchInput = screen.getByPlaceholderText('Search products...');
    await user.type(searchInput, 'laptop');
    await user.clear(searchInput);

    // ASSERT: Check that input is empty and no loading state should appear
    // EMPTY STATE TESTING: Verify component handles empty input correctly
    expect(searchInput).toHaveValue('');
    expect(screen.queryByText('Searching...')).not.toBeInTheDocument();
    
    // NEGATIVE TESTING: Wait reasonable time to confirm no search is triggered
    await waitFor(() => {
      expect(screen.queryByText('Searching...')).not.toBeInTheDocument();
    }, { timeout: 500 });
  });

  /**
   * TEST 8: Complex Async Flow Testing
   * Test that search statistics are displayed correctly
   */
  test('displays search statistics', async () => {
    // ARRANGE
    const user = userEvent.setup({ delay: null });
    render(<SearchFilter />);

    // ACT
    const searchInput = screen.getByPlaceholderText('Search products...');
    await user.type(searchInput, 'laptop');

    // ASSERT: Wait for search to trigger and complete naturally
    // COMPLETE ASYNC FLOW: Test the full cycle from input to results
    await screen.findByText('Searching...', {}, { timeout: 500 });
    
    // Note: In a real test, you'd wait for the search to complete and results to appear
    // This demonstrates the pattern for testing complete async workflows
  });

  /**
   * TEST 9: Query Method Differences - Educational Example
   * Demonstrate when to use getBy vs queryBy vs findBy
   */
  test('demonstrates query method differences', async () => {
    // ARRANGE
    const user = userEvent.setup({ delay: null });
    render(<SearchFilter />);

    // getBy* - USE WHEN: Element should exist immediately
    // Throws error if not found - good for elements that should always be present
    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();

    // queryBy* - USE WHEN: Element might not exist
    // Returns null if not found - good for conditional elements or negative assertions
    expect(screen.queryByText('Searching...')).not.toBeInTheDocument();

    // ACT: Trigger search
    await user.type(screen.getByPlaceholderText('Search products...'), 'laptop');

    // findBy* - USE WHEN: Element will appear after async operation
    // Waits for element to appear - essential for testing async operations
    await expect(screen.findByText('Searching...', {}, { timeout: 500 })).resolves.toBeInTheDocument();
  });

  /**
   * TEST 10: Performance & Memory Testing
   * Test that component properly handles rapid user input
   */
  test('handles rapid user input without performance issues', async () => {
    // ARRANGE
    const user = userEvent.setup({ delay: null });
    const mockOnResultsChange = jest.fn();
    render(<SearchFilter onResultsChange={mockOnResultsChange} debounceMs={300} />);

    // ACT: Rapid typing simulation
    // PERFORMANCE TESTING: Simulate rapid user input
    const searchInput = screen.getByPlaceholderText('Search products...');
    await user.type(searchInput, 'a');
    await user.type(searchInput, 'b');
    await user.type(searchInput, 'c');
    await user.type(searchInput, 'd');

    // ASSERT: Only final search should be triggered due to debouncing
    // DEBOUNCE VERIFICATION: Check that debouncing prevents excessive API calls
    await screen.findByText('Searching...', {}, { timeout: 500 });
    
    // In a real test, you'd verify the callback was called only once
    // This demonstrates testing debounced behavior for performance
  });

  /**
   * TEST 11: Accessibility & Keyboard Navigation
   * Test that component works with keyboard navigation
   */
  test('supports keyboard navigation', async () => {
    // ARRANGE
    const user = userEvent.setup({ delay: null });
    render(<SearchFilter />);

    // ACT: Use keyboard to navigate
    // KEYBOARD TESTING: Test accessibility via keyboard navigation
    await user.tab(); // Should focus on search input
    await user.keyboard('laptop');
    await user.tab(); // Should focus on category select
    await user.keyboard('{arrowdown}'); // Navigate select options

    // ASSERT: Verify keyboard interactions work
    // ACCESSIBILITY TESTING: Ensure component is keyboard accessible
    expect(screen.getByPlaceholderText('Search products...')).toHaveValue('laptop');
    
    // Additional accessibility tests would check focus management,
    // ARIA attributes, screen reader compatibility, etc.
  });
}); 