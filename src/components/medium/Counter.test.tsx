/**
 * MEDIUM EXAMPLE 1: Testing State Management and User Interactions
 * 
 * This test file demonstrates:
 * - Testing user interactions with userEvent (preferred for modern tests)
 * - Testing state changes and updates
 * - Testing disabled states and boundary conditions
 * - Testing edge cases and input validation
 * - Testing component re-renders and prop effects
 */

/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from './Counter';

// TEST SUITE: Groups related tests for the Counter component
describe('Counter Component', () => {
  
  /**
   * TEST 1: Initial State
   * Test that the component renders with correct initial state
   */
  test('renders with default initial count', () => {
    // ARRANGE
    render(<Counter />);
    
    // ACT & ASSERT: Check initial display
    expect(screen.getByText('0')).toBeInTheDocument();
    
    // ACCESSIBILITY TESTING: Check that all buttons are present and accessible
    // Using getByRole with name option - name refers to accessible name (aria-label)
    expect(screen.getByRole('button', { name: /increase count/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /decrease count/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset count/i })).toBeInTheDocument();
  });

  test('renders with custom initial count', () => {
    // ARRANGE: Render with custom initial value
    // PROPS TESTING: Verify component respects initial prop values
    render(<Counter initialCount={5} />);
    
    // ACT & ASSERT: Check custom initial display
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  /**
   * TEST 2: User Interactions with userEvent
   * Test that clicking the increment button increases the count
   */
  test('increments count when increment button is clicked', async () => {
    // ARRANGE
    // userEvent.setup() - MODERN APPROACH: More realistic than fireEvent
    // userEvent simulates real user interactions (hover, focus, click sequence)
    const user = userEvent.setup();
    render(<Counter />);
    const incrementButton = screen.getByRole('button', { name: /increase count/i });
    
    // ACT: Click increment button
    // await user.click() - ASYNC INTERACTION: userEvent methods are async
    // This better simulates real user behavior with proper timing
    await user.click(incrementButton);
    
    // ASSERT: Check that count increased
    // STATE CHANGE TESTING: Verify component state updated correctly
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('increments by custom step value', async () => {
    // ARRANGE: Render with custom step
    const user = userEvent.setup();
    render(<Counter step={5} />);
    const incrementButton = screen.getByRole('button', { name: /increase count/i });
    
    // ACT: Click increment button
    await user.click(incrementButton);
    
    // ASSERT: Check that count increased by step value
    // PROP INTERACTION TESTING: Verify props affect component behavior
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  /**
   * TEST 3: State Management Testing
   * Test that clicking the decrement button decreases the count
   */
  test('decrements count when decrement button is clicked', async () => {
    // ARRANGE: Start with positive count
    const user = userEvent.setup();
    render(<Counter initialCount={5} />);
    const decrementButton = screen.getByRole('button', { name: /decrease count/i });
    
    // ACT: Click decrement button
    await user.click(decrementButton);
    
    // ASSERT: Check that count decreased
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  /**
   * TEST 4: Reset Functionality
   * Test that clicking the reset button resets to initial value
   */
  test('resets count to initial value when reset button is clicked', async () => {
    // ARRANGE: Start with initial count and modify it
    const user = userEvent.setup();
    render(<Counter initialCount={10} />);
    const incrementButton = screen.getByRole('button', { name: /increase count/i });
    const resetButton = screen.getByRole('button', { name: /reset count/i });
    
    // ACT: Modify count then reset
    await user.click(incrementButton);
    await user.click(incrementButton);
    // INTERMEDIATE ASSERTION: Verify state changed before reset
    expect(screen.getByText('12')).toBeInTheDocument();
    
    await user.click(resetButton);
    
    // ASSERT: Check that count reset to initial value
    // RESET LOGIC TESTING: Verify reset returns to initial state, not zero
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  /**
   * TEST 5: Multiple Interactions & Sequence Testing
   * Test multiple button clicks in sequence
   */
  test('handles multiple button clicks correctly', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<Counter />);
    const incrementButton = screen.getByRole('button', { name: /increase count/i });
    const decrementButton = screen.getByRole('button', { name: /decrease count/i });
    
    // ACT: Multiple clicks
    // SEQUENCE TESTING: Test complex user interaction patterns
    await user.click(incrementButton);
    await user.click(incrementButton);
    await user.click(incrementButton);
    expect(screen.getByText('3')).toBeInTheDocument();
    
    await user.click(decrementButton);
    
    // ASSERT: Check final value
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  /**
   * TEST 6: Boundary Testing & Edge Cases
   * Test that the counter respects min and max boundaries
   */
  test('respects maximum boundary', async () => {
    // ARRANGE: Set max value
    const user = userEvent.setup();
    render(<Counter initialCount={5} max={5} />);
    const incrementButton = screen.getByRole('button', { name: /increase count/i });
    
    // ACT: Try to increment beyond max
    await user.click(incrementButton);
    
    // ASSERT: Count should not exceed max
    // BOUNDARY TESTING: Verify component respects constraints
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('respects minimum boundary', async () => {
    // ARRANGE: Set min value
    const user = userEvent.setup();
    render(<Counter initialCount={0} min={0} />);
    const decrementButton = screen.getByRole('button', { name: /decrease count/i });
    
    // ACT: Try to decrement below min
    await user.click(decrementButton);
    
    // ASSERT: Count should not go below min
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  /**
   * TEST 7: Disabled State Testing
   * Test that buttons are disabled when appropriate
   */
  test('disables increment button when at maximum', () => {
    // ARRANGE: Start at maximum
    render(<Counter initialCount={10} max={10} />);
    
    // ACT & ASSERT: Increment button should be disabled
    // DISABLED STATE TESTING: Verify buttons are disabled at boundaries
    const incrementButton = screen.getByRole('button', { name: /increase count/i });
    expect(incrementButton).toBeDisabled();
    
    // toBeDisabled() - Jest matcher for checking disabled state
    // Important for accessibility and user experience
  });

  test('disables decrement button when at minimum', () => {
    // ARRANGE: Start at minimum
    render(<Counter initialCount={0} min={0} />);
    
    // ACT & ASSERT: Decrement button should be disabled
    const decrementButton = screen.getByRole('button', { name: /decrease count/i });
    expect(decrementButton).toBeDisabled();
  });

  test('enables buttons when not at boundaries', () => {
    // ARRANGE: Set boundaries with count in middle
    render(<Counter initialCount={5} min={0} max={10} />);
    
    // ACT & ASSERT: Both buttons should be enabled
    const incrementButton = screen.getByRole('button', { name: /increase count/i });
    const decrementButton = screen.getByRole('button', { name: /decrease count/i });
    
    // toBeEnabled() - Jest matcher for checking enabled state
    expect(incrementButton).toBeEnabled();
    expect(decrementButton).toBeEnabled();
  });

  /**
   * TEST 8: Component Remounting Testing
   * Test that new instances start with different initial values
   */
  test('creates new instances with different initial values', () => {
    // ARRANGE & ACT: Render first instance
    const { unmount } = render(<Counter initialCount={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
    
    // UNMOUNT & REMOUNT: Unmount and render new instance
    // This demonstrates that initialCount works correctly for fresh instances
    unmount();
    render(<Counter initialCount={10} />);
    
    // ASSERT: Check that new instance has different initial value
    // COMPONENT LIFECYCLE: Shows that initialCount is properly used for new instances
    expect(screen.getByText('10')).toBeInTheDocument();
  });
}); 