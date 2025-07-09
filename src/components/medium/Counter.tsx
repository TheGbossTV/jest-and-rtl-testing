/**
 * MEDIUM EXAMPLE 1: Counter Component with State Management
 * 
 * COMPONENT DESCRIPTION:
 * A counter component that manages internal state and handles user interactions.
 * This component demonstrates state management, event handling, and conditional rendering.
 * 
 * WHAT THIS COMPONENT DOES:
 * - Maintains a count value using useState
 * - Allows incrementing/decrementing the count with buttons
 * - Provides a reset button to return to initial value
 * - Enforces min/max boundaries for the count
 * - Disables buttons when limits are reached
 * - Supports custom step size for increment/decrement
 * - Displays current range and step information
 * 
 * WHAT SHOULD BE TESTED:
 * ✅ Displays initial count value correctly
 * ✅ Increments count when + button is clicked
 * ✅ Decrements count when - button is clicked
 * ✅ Resets count to initial value when reset button is clicked
 * ✅ Disables increment button when max limit is reached
 * ✅ Disables decrement button when min limit is reached
 * ✅ Respects custom step size for increments/decrements
 * ✅ Displays correct range and step information
 * ✅ Uses proper accessibility labels
 * 
 * TESTING CONCEPTS DEMONSTRATED:
 * - Testing state changes with user interactions
 * - Using userEvent for realistic user interactions
 * - Testing button disabled states
 * - Testing component re-renders after state changes
 * - Testing boundary conditions (min/max limits)
 * - Testing custom prop values
 * - Testing accessibility attributes
 */

import { useState } from 'react';

interface CounterProps {
  initialCount?: number;
  min?: number;
  max?: number;
  step?: number;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  step = 1
}) => {
  const [count, setCount] = useState(initialCount);

  const increment = () => {
    setCount(prevCount => Math.min(prevCount + step, max));
  };

  const decrement = () => {
    setCount(prevCount => Math.max(prevCount - step, min));
  };

  const reset = () => {
    setCount(initialCount);
  };

  const canIncrement = count < max;
  const canDecrement = count > min;

  return (
    <div className="component-with-tests">
      <div className="component-demo">
        <div className="counter">
          <h2>Counter</h2>
          
          <div className="counter-display">
            {count}
          </div>
          
          <div className="counter-controls">
            <button
              onClick={decrement}
              disabled={!canDecrement}
              aria-label="Decrease count"
            >
              -
            </button>
            
            <button
              onClick={reset}
              aria-label="Reset count"
            >
              Reset
            </button>
            
            <button
              onClick={increment}
              disabled={!canIncrement}
              aria-label="Increase count"
            >
              +
            </button>
          </div>
          
          <div className="counter-info">
            <p>Range: {min} to {max}</p>
            <p>Step: {step}</p>
          </div>
        </div>
      </div>
      
      <div className="test-coverage">
        <h4>🧪 Tests Covered:</h4>
        <ul>
          <li>✅ Increments/decrements on button clicks</li>
          <li>✅ Resets to initial value</li>
          <li>✅ Respects min/max boundaries</li>
          <li>✅ Disables buttons at limits</li>
          <li>✅ Uses custom step values</li>
          <li>✅ Displays range and step info</li>
        </ul>
      </div>
    </div>
  );
};

export default Counter; 