/**
 * EASY EXAMPLE 2: Testing Props and Conditional Rendering
 * 
 * This test file demonstrates:
 * - Testing components with multiple props and optional values
 * - Testing conditional rendering based on prop availability
 * - Using regex patterns for flexible text matching across HTML elements
 * - Testing CSS classes and dynamic styling
 * - Testing default prop values and edge cases
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserCard from './UserCard';

// TEST SUITE ORGANIZATION: Group related tests for better organization
describe('UserCard Component', () => {
  
  /**
   * TEST 1: Required Props Only
   * Test the component with only the required 'name' prop
   */
  test('renders with only required props', () => {
    // ARRANGE: Render with minimal props
    render(<UserCard name="John Doe" />);
    
    // ACT & ASSERT: Check that name is displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    
    // Check that default active status is applied
    expect(screen.getByText('🟢 Active')).toBeInTheDocument();
    
    // CONDITIONAL RENDERING TEST: Use queryBy* for elements that might not exist
    // queryBy* returns null instead of throwing error - perfect for negative assertions
    expect(screen.queryByText(/Email:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Age:/)).not.toBeInTheDocument();
    
    // REGEX PATTERNS: /Email:/ matches any text containing "Email:"
    // Useful when exact text position in DOM is unknown
  });

  /**
   * TEST 2: All Props Provided
   * Test the component with all possible props
   */
  test('renders with all props provided', () => {
    // ARRANGE: Render with all props
    // OBJECT SPREAD: Clean way to pass multiple props
    const props = {
      name: 'Jane Smith',
      email: 'jane@example.com',
      age: 25,
      isActive: true
    };
    
    render(<UserCard {...props} />);
    
    // ACT & ASSERT: Check all elements are present
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText(/Email:/)).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText(/Age:/)).toBeInTheDocument();
    expect(screen.getByText(/25 years old/)).toBeInTheDocument();
    expect(screen.getByText('🟢 Active')).toBeInTheDocument();
  });

  /**
   * TEST 3: Inactive User
   * Test the component when user is inactive
   */
  test('renders inactive user correctly', () => {
    // ARRANGE: Render with isActive set to false
    render(
      <UserCard 
        name="Bob Johnson" 
        email="bob@example.com"
        isActive={false}
      />
    );
    
    // ACT & ASSERT: Check inactive status
    expect(screen.getByText('🔴 Inactive')).toBeInTheDocument();
    // NEGATIVE ASSERTION: Verify active status is NOT shown
    expect(screen.queryByText('🟢 Active')).not.toBeInTheDocument();
  });

  /**
   * TEST 4: Conditional Rendering
   * Test different combinations of optional props
   */
  test('renders email but not age when only email is provided', () => {
    // ARRANGE
    render(
      <UserCard 
        name="Alice Brown" 
        email="alice@example.com"
      />
    );
    
    // ACT & ASSERT: Email should be present, age should not
    // This tests the conditional rendering logic in the component
    expect(screen.getByText(/Email:/)).toBeInTheDocument();
    expect(screen.queryByText(/Age:/)).not.toBeInTheDocument();
  });

  test('renders age but not email when only age is provided', () => {
    // ARRANGE
    render(
      <UserCard 
        name="Charlie Davis" 
        age={30}
      />
    );
    
    // ACT & ASSERT: Age should be present, email should not
    expect(screen.getByText(/Age:/)).toBeInTheDocument();
    expect(screen.getByText(/30 years old/)).toBeInTheDocument();
    expect(screen.queryByText(/Email:/)).not.toBeInTheDocument();
  });

  /**
   * TEST 5: CSS Classes Testing
   * Test that the correct CSS classes are applied based on props
   */
  test('applies correct CSS classes for active user', () => {
    // ARRANGE
    render(<UserCard name="Test User" isActive={true} />);
    
    // ACT & ASSERT: Check CSS classes on the container
    // DOM TRAVERSAL: closest() finds the nearest ancestor with the specified selector
    const container = screen.getByText('Test User').closest('.user-card');
    
    // toHaveClass() - Jest matcher for checking CSS classes
    expect(container).toHaveClass('user-card', 'active');
    expect(container).not.toHaveClass('inactive');
  });

  test('applies correct CSS classes for inactive user', () => {
    // ARRANGE
    render(<UserCard name="Test User" isActive={false} />);
    
    // ACT & ASSERT: Check CSS classes on the container
    const container = screen.getByText('Test User').closest('.user-card');
    expect(container).toHaveClass('user-card', 'inactive');
    expect(container).not.toHaveClass('active');
  });

  /**
   * TEST 6: Element Structure & Accessibility
   * Test the HTML structure and accessibility roles
   */
  test('has correct heading structure', () => {
    // ARRANGE
    render(<UserCard name="Test User" />);
    
    // ACT & ASSERT: Check heading role and level
    // getByRole() - Preferred method for accessibility testing
    // Tests both functionality and accessibility compliance
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Test User');
  });
}); 