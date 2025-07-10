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

// GROUP RELATED TESTS: describe() creates a test suite - organizes tests logically
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
    // screen.getByText() - IMPORTANT: This throws an error if element is not found
    // Use getBy* when you expect the element to exist
    expect(screen.getByText('Hello, World!')).toBeInTheDocument();
    expect(screen.getByText('Welcome to our testing tutorial.')).toBeInTheDocument();
    
    // toBeInTheDocument() - Jest matcher from @testing-library/jest-dom
    // Verifies the element exists in the DOM
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
    // getByRole() - Finds elements by their ARIA role (better for accessibility)
    // This is often preferred over text-based queries for semantic elements
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Hello, Alice!');
    
    // toHaveTextContent() - Checks if element contains specific text content
  });

  /**
   * TEST 4: Multiple Assertions & Query Methods
   * This test demonstrates different query methods and their use cases
   */
  test('contains all expected elements', () => {
    // ARRANGE
    render(<Greeting name="Bob" />);
    
    // ACT & ASSERT: Multiple assertions about the same rendered component
    expect(screen.getByText('Hello, Bob!')).toBeInTheDocument();
    expect(screen.getByText('Welcome to our testing tutorial.')).toBeInTheDocument();
    
    // KEY DIFFERENCE: queryBy* vs getBy*
    // queryBy* returns null if element not found (doesn't throw error)
    // Use queryBy* when you expect the element to NOT exist
    expect(screen.queryByText('Hello, World!')).not.toBeInTheDocument();
    
    // This is safer than using getBy* for negative assertions
    // getBy* would throw an error if element doesn't exist
  });
}); 