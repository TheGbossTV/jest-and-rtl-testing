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
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  /**
   * TEST 1: Initial Render
   * Test that component renders with initial state
   */
  test('renders initial search interface', () => {
    // ARRANGE & ACT
    render(<SearchFilter />);

    // ASSERT
    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
    expect(screen.getByLabelText('Category:')).toBeInTheDocument();
    expect(screen.getByLabelText('Min Price:')).toBeInTheDocument();
    expect(screen.getByLabelText('Max Price:')).toBeInTheDocument();
    expect(screen.getByLabelText('In Stock Only')).toBeInTheDocument();
    expect(screen.getByText('Clear All')).toBeInTheDocument();
  });

  /**
   * TEST 2: Search Input
   * Test basic search input functionality
   */
  test('handles search input changes', async () => {
    // ARRANGE
    const user = userEvent.setup({ delay: null });
    render(<SearchFilter />);

    // ACT
    const searchInput = screen.getByPlaceholderText('Search products...');
    await user.type(searchInput, 'laptop');

    // ASSERT
    expect(searchInput).toHaveValue('laptop');
  });

  /**
   * TEST 3: Debouncing with RTL
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
    expect(screen.queryByText('Searching...')).not.toBeInTheDocument();

    // ACT & ASSERT: Wait for debounced search to trigger by finding loading state
    await expect(screen.findByText('Searching...', {}, { timeout: 500 })).resolves.toBeInTheDocument();
  });

  /**
   * TEST 4: Filter Controls
   * Test that filter controls work correctly
   */
  test('handles filter changes', async () => {
    // ARRANGE
    const user = userEvent.setup({ delay: null });
    render(<SearchFilter />);

    // ACT: Change category filter
    const categorySelect = screen.getByLabelText('Category:');
    await user.selectOptions(categorySelect, 'electronics');

    // ACT: Change price range
    const minPriceInput = screen.getByLabelText('Min Price:');
    const maxPriceInput = screen.getByLabelText('Max Price:');
    await user.clear(minPriceInput);
    await user.type(minPriceInput, '100');
    await user.clear(maxPriceInput);
    await user.type(maxPriceInput, '1000');

    // ACT: Toggle in-stock filter
    const inStockCheckbox = screen.getByLabelText('In Stock Only');
    await user.click(inStockCheckbox);

    // ASSERT
    expect(categorySelect).toHaveValue('electronics');
    expect(minPriceInput).toHaveValue(100);
    expect(maxPriceInput).toHaveValue(1000);
    expect(inStockCheckbox).toBeChecked();
  });

  /**
   * TEST 5: Clear All Functionality
   * Test that clear all button resets all filters
   */
  test('clears all filters when clear button is clicked', async () => {
    // ARRANGE
    const user = userEvent.setup({ delay: null });
    render(<SearchFilter />);

    // ACT: Set some filters
    const searchInput = screen.getByPlaceholderText('Search products...');
    const categorySelect = screen.getByLabelText('Category:');
    const inStockCheckbox = screen.getByLabelText('In Stock Only');

    await user.type(searchInput, 'laptop');
    await user.selectOptions(categorySelect, 'electronics');
    await user.click(inStockCheckbox);

    // ACT: Clear all
    const clearButton = screen.getByText('Clear All');
    await user.click(clearButton);

    // ASSERT
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
    await expect(screen.findByText('Searching...', {}, { timeout: 200 })).resolves.toBeInTheDocument();
  });

  /**
   * TEST 7: Empty Search Handling
   * Test behavior when search input is empty
   */
  test('handles empty search input', async () => {
    // ARRANGE
    const user = userEvent.setup({ delay: null });
    render(<SearchFilter />);

    // ACT
    const searchInput = screen.getByPlaceholderText('Search products...');
    await user.type(searchInput, 'laptop');
    await user.clear(searchInput);

    // ASSERT: Check that input is empty and no loading state should appear
    expect(searchInput).toHaveValue('');
    expect(screen.queryByText('Searching...')).not.toBeInTheDocument();
    
    // Wait a reasonable amount of time to confirm no search is triggered
    await waitFor(() => {
      expect(screen.queryByText('Searching...')).not.toBeInTheDocument();
    }, { timeout: 500 });
  });

  /**
   * TEST 8: Search Statistics
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
    await screen.findByText('Searching...', {}, { timeout: 500 });
    
    // Wait for search to complete
    await waitFor(() => {
      expect(screen.queryByText('Searching...')).not.toBeInTheDocument();
    }, { timeout: 1000 });

    // ASSERT: Should show search statistics
    expect(screen.getByText(/Searches performed:/)).toBeInTheDocument();
    expect(screen.getByText(/Results found:/)).toBeInTheDocument();
  });

  /**
   * TEST 9: Component Props
   * Test that component respects different prop configurations
   */
  test('respects custom props', () => {
    // ARRANGE & ACT
    render(
      <SearchFilter
        placeholder="Custom placeholder"
        debounceMs={500}
        maxResults={5}
      />
    );

    // ASSERT
    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
  });

  /**
   * TEST 10: Accessibility
   * Test that component is accessible
   */
  test('has proper accessibility attributes', () => {
    // ARRANGE & ACT
    render(<SearchFilter />);

    // ASSERT
    const searchInput = screen.getByPlaceholderText('Search products...');
    const categorySelect = screen.getByLabelText('Category:');
    const minPriceInput = screen.getByLabelText('Min Price:');
    const maxPriceInput = screen.getByLabelText('Max Price:');
    const inStockCheckbox = screen.getByLabelText('In Stock Only');

    expect(searchInput).toBeInTheDocument();
    expect(categorySelect).toBeInTheDocument();
    expect(minPriceInput).toBeInTheDocument();
    expect(maxPriceInput).toBeInTheDocument();
    expect(inStockCheckbox).toBeInTheDocument();
  });

  /**
   * TEST 11: Complex Filter Combinations
   * Test that multiple filters work together correctly
   */
  test('handles complex filter combinations', async () => {
    // ARRANGE
    const user = userEvent.setup({ delay: null });
    const mockOnResultsChange = jest.fn();
    render(<SearchFilter onResultsChange={mockOnResultsChange} />);

    // ACT: Apply multiple filters
    const searchInput = screen.getByPlaceholderText('Search products...');
    const categorySelect = screen.getByLabelText('Category:');
    const minPriceInput = screen.getByLabelText('Min Price:');
    const inStockCheckbox = screen.getByLabelText('In Stock Only');

    await user.type(searchInput, 'laptop');
    await user.selectOptions(categorySelect, 'electronics');
    await user.clear(minPriceInput);
    await user.type(minPriceInput, '100');
    await user.click(inStockCheckbox);

    // ASSERT: Should trigger search with all filters naturally
    await expect(screen.findByText('Searching...', {}, { timeout: 500 })).resolves.toBeInTheDocument();
  });

  /**
   * TEST 12: Performance Considerations
   * Test that component handles rapid user input efficiently
   */
  test('handles rapid user input efficiently', async () => {
    // ARRANGE
    const user = userEvent.setup({ delay: null });
    render(<SearchFilter debounceMs={100} />);

    // ACT: Simulate rapid typing
    const searchInput = screen.getByPlaceholderText('Search products...');
    await user.type(searchInput, 'laptop');

    // ASSERT: Should not show loading during rapid typing
    expect(screen.queryByText('Searching...')).not.toBeInTheDocument();

    // ASSERT: Should eventually show loading after debounce naturally
    await expect(screen.findByText('Searching...', {}, { timeout: 200 })).resolves.toBeInTheDocument();
  });
}); 