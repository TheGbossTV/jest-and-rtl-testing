/**
 * EASY EXAMPLE 1: Basic Component Testing
 * 
 * This test file demonstrates fundamental React Testing Library concepts:
 * - How to render components
 * - How to find elements by text
 * - Basic assertions
 * - Testing with different props
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Greeting from './Greeting';

// Group related tests together using describe()
describe('Greeting Component', () => {
  
  /**
   * TEST 1: Basic Rendering
   * This test checks if the component renders without crashing
   * and displays the expected default text
   */
  test('renders default greeting message', () => {
    // ARRANGE: Set up the test by rendering the component
    render(<Greeting />);
    
    // ACT & ASSERT: Find elements and make assertions
    // screen.getByText() looks for text content in the rendered component
    expect(screen.getByText('Hello, World!')).toBeInTheDocument();
    expect(screen.getByText('Welcome to our testing tutorial.')).toBeInTheDocument();
  });

  /**
   * TEST 2: Props Testing
   * This test verifies that the component correctly uses props
   */
  test('renders custom name when provided', () => {
    // ARRANGE: Render component with a custom prop
    const customName = 'John';
    render(<Greeting name={customName} />);
    
    // ACT & ASSERT: Check that the custom name appears in the output
    expect(screen.getByText('Hello, John!')).toBeInTheDocument();
    
    // The welcome message should still be there
    expect(screen.getByText('Welcome to our testing tutorial.')).toBeInTheDocument();
  });

  /**
   * TEST 3: Element Structure
   * This test checks the HTML structure of the component
   */
  test('renders with correct HTML structure', () => {
    // ARRANGE
    render(<Greeting name="Alice" />);
    
    // ACT & ASSERT: Check for specific HTML elements
    // getByRole() finds elements by their accessibility role
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Hello, Alice!');
  });

  /**
   * TEST 4: Multiple Assertions
   * This test demonstrates how to make multiple assertions in one test
   */
  test('contains all expected elements', () => {
    // ARRANGE
    render(<Greeting name="Bob" />);
    
    // ACT & ASSERT: Multiple assertions about the same rendered component
    expect(screen.getByText('Hello, Bob!')).toBeInTheDocument();
    expect(screen.getByText('Welcome to our testing tutorial.')).toBeInTheDocument();
    
    // We can also check that certain text is NOT present
    expect(screen.queryByText('Hello, World!')).not.toBeInTheDocument();
  });
}); 