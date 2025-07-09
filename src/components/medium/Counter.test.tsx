/**
 * MEDIUM EXAMPLE 1: Testing State Management and User Interactions
 * 
 * This test file demonstrates:
 * - Testing user interactions with fireEvent
 * - Testing state changes and updates
 * - Testing disabled states
 * - Testing edge cases and boundaries
 * - Testing component re-renders
 */

/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './Counter';

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
    
    // Check that all buttons are present
    expect(screen.getByRole('button', { name: /increase count/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /decrease count/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset count/i })).toBeInTheDocument();
  });

  test('renders with custom initial count', () => {
    // ARRANGE: Render with custom initial value
    render(<Counter initialCount={5} />);
    
    // ACT & ASSERT: Check custom initial display
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  /**
   * TEST 2: Increment Functionality
   * Test that clicking the increment button increases the count
   */
  test('increments count when increment button is clicked', () => {
    // ARRANGE
    render(<Counter />);
    const incrementButton = screen.getByRole('button', { name: /increase count/i });
    
    // ACT: Click increment button
    fireEvent.click(incrementButton);
    
    // ASSERT: Check that count increased
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('increments by custom step value', () => {
    // ARRANGE: Render with custom step
    render(<Counter step={5} />);
    const incrementButton = screen.getByRole('button', { name: /increase count/i });
    
    // ACT: Click increment button
    fireEvent.click(incrementButton);
    
    // ASSERT: Check that count increased by step value
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  /**
   * TEST 3: Decrement Functionality
   * Test that clicking the decrement button decreases the count
   */
  test('decrements count when decrement button is clicked', () => {
    // ARRANGE: Start with positive count
    render(<Counter initialCount={5} />);
    const decrementButton = screen.getByRole('button', { name: /decrease count/i });
    
    // ACT: Click decrement button
    fireEvent.click(decrementButton);
    
    // ASSERT: Check that count decreased
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  /**
   * TEST 4: Reset Functionality
   * Test that clicking the reset button resets to initial value
   */
  test('resets count to initial value when reset button is clicked', () => {
    // ARRANGE: Start with initial count and modify it
    render(<Counter initialCount={10} />);
    const incrementButton = screen.getByRole('button', { name: /increase count/i });
    const resetButton = screen.getByRole('button', { name: /reset count/i });
    
    // ACT: Modify count then reset
    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    expect(screen.getByText('12')).toBeInTheDocument(); // Verify it changed
    
    fireEvent.click(resetButton);
    
    // ASSERT: Check that count reset to initial value
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  /**
   * TEST 5: Multiple Interactions
   * Test multiple button clicks in sequence
   */
  test('handles multiple button clicks correctly', () => {
    // ARRANGE
    render(<Counter />);
    const incrementButton = screen.getByRole('button', { name: /increase count/i });
    const decrementButton = screen.getByRole('button', { name: /decrease count/i });
    
    // ACT: Multiple clicks
    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    expect(screen.getByText('3')).toBeInTheDocument();
    
    fireEvent.click(decrementButton);
    
    // ASSERT: Check final value
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  /**
   * TEST 6: Boundary Testing (Min/Max)
   * Test that the counter respects min and max boundaries
   */
  test('respects maximum boundary', () => {
    // ARRANGE: Set max value
    render(<Counter initialCount={5} max={5} />);
    const incrementButton = screen.getByRole('button', { name: /increase count/i });
    
    // ACT: Try to increment beyond max
    fireEvent.click(incrementButton);
    
    // ASSERT: Count should not exceed max
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('respects minimum boundary', () => {
    // ARRANGE: Set min value
    render(<Counter initialCount={0} min={0} />);
    const decrementButton = screen.getByRole('button', { name: /decrease count/i });
    
    // ACT: Try to decrement below min
    fireEvent.click(decrementButton);
    
    // ASSERT: Count should not go below min
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  /**
   * TEST 7: Button Disabled States
   * Test that buttons are disabled when appropriate
   */
  test('disables increment button when at maximum', () => {
    // ARRANGE: Start at maximum
    render(<Counter initialCount={10} max={10} />);
    
    // ACT & ASSERT: Increment button should be disabled
    const incrementButton = screen.getByRole('button', { name: /increase count/i });
    expect(incrementButton).toBeDisabled();
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
    
    expect(incrementButton).toBeEnabled();
    expect(decrementButton).toBeEnabled();
  });

  /**
   * TEST 8: Accessibility
   * Test that buttons have proper aria labels
   */
  test('has accessible button labels', () => {
    // ARRANGE
    render(<Counter />);
    
    // ACT & ASSERT: Check aria labels
    expect(screen.getByLabelText('Increase count')).toBeInTheDocument();
    expect(screen.getByLabelText('Decrease count')).toBeInTheDocument();
    expect(screen.getByLabelText('Reset count')).toBeInTheDocument();
  });

  /**
   * TEST 9: Info Display
   * Test that component displays range and step information
   */
  test('displays range and step information', () => {
    // ARRANGE: Render with custom values
    render(<Counter min={1} max={20} step={2} />);
    
    // ACT & ASSERT: Check info display
    expect(screen.getByText('Range: 1 to 20')).toBeInTheDocument();
    expect(screen.getByText('Step: 2')).toBeInTheDocument();
  });
}); 