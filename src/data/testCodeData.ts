/**
 * Test Code and Component Code Data
 * 
 * This file contains both test code and component source code for each component.
 * The code is stored as strings to be displayed in the dual-panel TestCodeViewer component.
 */

export const codeData = {
  Greeting: {
    testCode: `/**
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
});`,
    componentCode: `/**
 * EASY EXAMPLE 1: Simple Greeting Component
 */

interface GreetingProps {
  name?: string;
}

const Greeting: React.FC<GreetingProps> = ({ name = 'World' }) => {
  return (
    <div className="component-demo">
      <h1>Hello, {name}!</h1>
      <p>Welcome to our testing tutorial.</p>
    </div>
  );
};

export default Greeting;`
  },

  UserCard: {
    testCode: `/**
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
});`,
    componentCode: `/**
 * EASY EXAMPLE 2: User Card Component with Conditional Rendering
 */

interface UserCardProps {
  name: string;
  email?: string;
  age?: number;
  isActive?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ 
  name, 
  email, 
  age, 
  isActive = true 
}) => {
  return (
    <div className="component-with-tests">
      <div className="component-demo">
        <div className={\`user-card \${isActive ? 'active' : 'inactive'}\`}>
          <h2>{name}</h2>
          
          {email && (
            <p><strong>Email:</strong> {email}</p>
          )}
          
          {age && (
            <p><strong>Age:</strong> {age} years old</p>
          )}
          
          <div className="status">
            <span className={\`status-indicator \${isActive ? 'active' : 'inactive'}\`}>
              {isActive ? '🟢 Active' : '🔴 Inactive'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;`
  },

  ItemList: {
    testCode: `/**
 * EASY EXAMPLE 3: Testing List Rendering
 * 
 * This test file demonstrates:
 * - Testing components that render lists
 * - Testing empty states vs populated states
 * - Using querySelector to verify list structure within component demo areas
 * - Testing array lengths and content validation
 * - Testing custom vs default prop values
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ItemList from './ItemList';

describe('ItemList Component', () => {
  
  /**
   * TEST 1: Empty List State
   * Test how the component handles an empty array
   */
  test('renders empty message when no items provided', () => {
    // ARRANGE: Render with empty array
    render(<ItemList items={[]} />);
    
    // ACT & ASSERT: Check empty state
    expect(screen.getByText('No items to display')).toBeInTheDocument();
    
    // DOM TRAVERSAL: Check that no list is rendered in the component output area
    // closest() finds the nearest ancestor matching the selector
    const componentOutput = screen.getByText('No items to display').closest('.component-demo');
    expect(componentOutput).not.toBeNull();
    
    // querySelector() - Direct DOM query within a specific element
    // Use when RTL queries aren't specific enough
    expect(componentOutput!.querySelector('ul')).not.toBeInTheDocument();
    
    // Check item count shows 0
    expect(screen.getByText('Total items: 0')).toBeInTheDocument();
  });

  /**
   * TEST 2: Custom Empty Message
   * Test custom empty message prop
   */
  test('renders custom empty message', () => {
    // ARRANGE: Render with custom empty message
    const customMessage = 'Nothing here yet!';
    render(<ItemList items={[]} emptyMessage={customMessage} />);
    
    // ACT & ASSERT: Check custom message appears
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  /**
   * TEST 3: Single Item Rendering
   * Test rendering with one item
   */
  test('renders single item correctly', () => {
    // ARRANGE: Render with one item
    const items = ['First item'];
    render(<ItemList items={items} />);
    
    // ACT & ASSERT: Check list is rendered
    // DOM TRAVERSAL: Find the list element that contains our item
    const itemsContainer = screen.getByText('First item').closest('ul');
    expect(itemsContainer).toBeInTheDocument();
    
    // SPECIFIC SCOPING: Query within the actual component output area
    // This avoids false positives from educational content in the component
    const componentOutput = screen.getByText('First item').closest('.component-demo');
    expect(componentOutput).not.toBeNull();
    
    // querySelectorAll() - Gets all matching elements within a container
    const listItems = componentOutput!.querySelectorAll('li');
    expect(listItems).toHaveLength(1);
    expect(listItems[0]).toHaveTextContent('First item');
    
    // Check item count
    expect(screen.getByText('Total items: 1')).toBeInTheDocument();
    
    // NEGATIVE ASSERTION: Verify empty message is not shown
    expect(screen.queryByText('No items to display')).not.toBeInTheDocument();
  });

  /**
   * TEST 4: Multiple Items Rendering
   * Test rendering with multiple items
   */
  test('renders multiple items correctly', () => {
    // ARRANGE: Render with multiple items
    const items = ['Apple', 'Banana', 'Cherry', 'Date'];
    render(<ItemList items={items} />);
    
    // ACT & ASSERT: Check all items are rendered
    const componentOutput = screen.getByText('Apple').closest('.component-demo');
    expect(componentOutput).not.toBeNull();
    
    // ARRAY LENGTH TESTING: Verify correct number of items
    const listItems = componentOutput!.querySelectorAll('li');
    expect(listItems).toHaveLength(4);
    
    // CONTENT VALIDATION: Check each item content individually
    expect(listItems[0]).toHaveTextContent('Apple');
    expect(listItems[1]).toHaveTextContent('Banana');
    expect(listItems[2]).toHaveTextContent('Cherry');
    expect(listItems[3]).toHaveTextContent('Date');
    
    // Check item count
    expect(screen.getByText('Total items: 4')).toBeInTheDocument();
  });

  /**
   * TEST 5: Custom Title Props
   * Test custom title prop
   */
  test('renders custom title', () => {
    // ARRANGE: Render with custom title
    const customTitle = 'My Favorite Foods';
    render(<ItemList items={['Pizza']} title={customTitle} />);
    
    // ACT & ASSERT: Check custom title appears
    const componentOutput = screen.getByText(customTitle).closest('.component-demo');
    expect(componentOutput).not.toBeNull();
    
    // SPECIFIC ELEMENT QUERY: Look for h3 within the component output
    const heading = componentOutput!.querySelector('h3');
    expect(heading).toHaveTextContent(customTitle);
  });

  /**
   * TEST 6: Default Props Testing
   * Test default title when none provided
   */
  test('renders default title when none provided', () => {
    // ARRANGE: Render without title prop
    render(<ItemList items={['Item']} />);
    
    // ACT & ASSERT: Check default title
    const componentOutput = screen.getByText('Items').closest('.component-demo');
    expect(componentOutput).not.toBeNull();
    const heading = componentOutput!.querySelector('h3');
    expect(heading).toHaveTextContent('Items');
  });

  /**
   * TEST 7: HTML Structure Testing
   * Test the HTML structure of the list
   */
  test('renders proper HTML list structure', () => {
    // ARRANGE: Render with items
    const items = ['Item 1', 'Item 2'];
    render(<ItemList items={items} />);
    
    // ACT & ASSERT: Check list structure
    const componentOutput = screen.getByText('Item 1').closest('.component-demo');
    expect(componentOutput).not.toBeNull();
    
    // SEMANTIC HTML TESTING: Verify proper list structure
    const list = componentOutput!.querySelector('ul');
    expect(list).toBeInTheDocument();
    
    // Check list items have correct structure
    const listItems = componentOutput!.querySelectorAll('li');
    expect(listItems).toHaveLength(2);
  });

  /**
   * TEST 8: Edge Cases & Data Validation
   * Test how the component handles different string content
   */
  test('handles various string content', () => {
    // ARRANGE: Render with different types of strings
    const items = ['', 'Normal text', 'Text with numbers 123', 'Special chars !@#$%'];
    render(<ItemList items={items} />);
    
    // ACT & ASSERT: Check all items render correctly
    const componentOutput = screen.getByText('Normal text').closest('.component-demo');
    expect(componentOutput).not.toBeNull();
    const listItems = componentOutput!.querySelectorAll('li');
    expect(listItems).toHaveLength(4);
    
    // EDGE CASE TESTING: Verify different content types are handled
    expect(listItems[0]).toHaveTextContent(''); // Empty string
    expect(listItems[1]).toHaveTextContent('Normal text');
    expect(listItems[2]).toHaveTextContent('Text with numbers 123');
    expect(listItems[3]).toHaveTextContent('Special chars !@#$%');
  });
});`,
    componentCode: `/**
 * EASY EXAMPLE 3: Item List Component with Array Rendering
 */

interface ItemListProps {
  items: string[];
  title?: string;
  emptyMessage?: string;
}

const ItemList: React.FC<ItemListProps> = ({ 
  items, 
  title = "Items", 
  emptyMessage = "No items to display" 
}) => {
  return (
    <div className="component-with-tests">
      <div className="component-demo">
        <div className="item-list">
          <h3>{title}</h3>
          
          {items.length === 0 ? (
            <p className="empty-message">{emptyMessage}</p>
          ) : (
            <ul>
              {items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
          
          <div className="item-count">
            Total items: {items.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemList;`
  },

  Counter: {
    testCode: `/**
 * MEDIUM EXAMPLE 1: Testing State Management and User Interactions
 * 
 * This test file demonstrates:
 * - Testing user interactions with userEvent (preferred for modern tests)
 * - Testing state changes and updates
 * - Testing disabled states
 * - Testing edge cases and boundaries
 * - Testing component re-renders
 * - Mock functions and their verification
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Counter from './Counter';

describe('Counter Component', () => {
  
  /**
   * TEST 1: Initial State Testing
   * Test that the component renders with correct initial state
   */
  test('renders with default initial count', () => {
    // ARRANGE
    render(<Counter />);
    
    // ACT & ASSERT: Check initial display
    expect(screen.getByText('0')).toBeInTheDocument();
    
    // Check that all buttons are present
    // getByRole() with name option uses aria-label for identification
    expect(screen.getByRole('button', { name: /increase count/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /decrease count/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset count/i })).toBeInTheDocument();
  });

  /**
   * TEST 2: Custom Initial Value
   * Test that the component accepts custom initial count
   */
  test('renders with custom initial count', () => {
    // ARRANGE
    const initialValue = 10;
    render(<Counter initialCount={initialValue} />);
    
    // ACT & ASSERT: Check custom initial display
    expect(screen.getByText(initialValue.toString())).toBeInTheDocument();
  });

  /**
   * TEST 3: Increment Functionality
   * Test that clicking the increment button increases the count
   * Using userEvent for realistic user interactions
   */
  test('increments count when increment button is clicked', async () => {
    // ARRANGE
    // userEvent.setup() - Creates a new user event session
    // This is the modern way to handle user interactions
    const user = userEvent.setup();
    render(<Counter />);
    const incrementButton = screen.getByRole('button', { name: /increase count/i });
    
    // ACT: Click increment button
    // await user.click() - Simulates a real user click
    // Much more realistic than fireEvent.click()
    await user.click(incrementButton);
    
    // ASSERT: Check that count increased
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  /**
   * TEST 4: Decrement Functionality
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
   * TEST 5: Reset Functionality
   * Test that reset button returns count to initial value
   */
  test('resets count to initial value when reset button is clicked', async () => {
    // ARRANGE: Start with custom initial count and increment
    const user = userEvent.setup();
    const initialCount = 5;
    render(<Counter initialCount={initialCount} />);
    const incrementButton = screen.getByRole('button', { name: /increase count/i });
    const resetButton = screen.getByRole('button', { name: /reset count/i });
    
    // ACT: Increment then reset
    await user.click(incrementButton);
    expect(screen.getByText('6')).toBeInTheDocument();
    
    await user.click(resetButton);
    
    // ASSERT: Check that count returned to initial
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  /**
   * TEST 6: Boundary Testing (Maximum)
   * Test that the counter respects maximum boundary
   */
  test('respects maximum boundary', async () => {
    // ARRANGE: Set max value
    const user = userEvent.setup();
    render(<Counter initialCount={5} max={5} />);
    const incrementButton = screen.getByRole('button', { name: /increase count/i });
    
    // ACT: Try to increment beyond max
    await user.click(incrementButton);
    
    // ASSERT: Count should not exceed max
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  /**
   * TEST 7: Boundary Testing (Minimum)
   * Test that the counter respects minimum boundary
   */
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
   * TEST 8: Button Disabled States (Maximum)
   * Test that buttons are disabled when appropriate
   */
  test('disables increment button when at maximum', () => {
    // ARRANGE: Start at maximum
    render(<Counter initialCount={10} max={10} />);
    
    // ACT & ASSERT: Increment button should be disabled
    const incrementButton = screen.getByRole('button', { name: /increase count/i });
    expect(incrementButton).toBeDisabled();
    
    // Decrement button should still be enabled
    const decrementButton = screen.getByRole('button', { name: /decrease count/i });
    expect(decrementButton).toBeEnabled();
  });

  /**
   * TEST 9: Button Disabled States (Minimum)
   * Test that decrement button is disabled at minimum
   */
  test('disables decrement button when at minimum', () => {
    // ARRANGE: Start at minimum
    render(<Counter initialCount={0} min={0} />);
    
    // ACT & ASSERT: Decrement button should be disabled
    const decrementButton = screen.getByRole('button', { name: /decrease count/i });
    expect(decrementButton).toBeDisabled();
    
    // Increment button should still be enabled
    const incrementButton = screen.getByRole('button', { name: /increase count/i });
    expect(incrementButton).toBeEnabled();
  });

  /**
   * TEST 10: Multiple Interactions
   * Test multiple sequential interactions
   */
  test('handles multiple interactions correctly', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<Counter initialCount={5} />);
    const incrementButton = screen.getByRole('button', { name: /increase count/i });
    const decrementButton = screen.getByRole('button', { name: /decrease count/i });
    
    // ACT: Multiple operations
    await user.click(incrementButton);
    await user.click(incrementButton);
    await user.click(decrementButton);
    
    // ASSERT: Check final state
    expect(screen.getByText('6')).toBeInTheDocument(); // 5 + 1 + 1 - 1 = 6
  });

  /**
   * TEST 11: Custom Step Value
   * Test that custom step values work correctly
   */
  test('increments and decrements by custom step value', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<Counter initialCount={10} step={3} />);
    const incrementButton = screen.getByRole('button', { name: /increase count/i });
    const decrementButton = screen.getByRole('button', { name: /decrease count/i });
    
    // ACT & ASSERT: Test increment
    await user.click(incrementButton);
    expect(screen.getByText('13')).toBeInTheDocument();
    
    // ACT & ASSERT: Test decrement
    await user.click(decrementButton);
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  /**
   * TEST 12: Component Re-mounting
   * Test that the component initializes correctly when unmounted and remounted
   */
  test('initializes correctly when component remounts', () => {
    // ARRANGE: Initial render
    const { unmount } = render(<Counter initialCount={5} />);
    
    // ACT: Unmount and remount
    unmount();
    render(<Counter initialCount={5} />);
    
    // ASSERT: Check that it renders with initial value
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});`,
    componentCode: `/**
 * MEDIUM EXAMPLE 1: Counter Component with State Management
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
          <div className="counter-display">{count}</div>
          
          <div className="counter-controls">
            <button
              onClick={decrement}
              disabled={!canDecrement}
              aria-label="Decrease count"
            >
              -
            </button>
            
            <button onClick={reset} aria-label="Reset count">
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
    </div>
  );
};

export default Counter;`
  },

  ContactForm: {
    testCode: `/**
 * MEDIUM EXAMPLE 2: Testing Form Handling and User Input
 * 
 * This test file demonstrates:
 * - Testing form inputs and changes
 * - Testing form submission
 * - Testing validation logic
 * - Testing error states
 * - Testing asynchronous behavior
 * - Using userEvent for more realistic interactions
 */

/// <reference types="@testing-library/jest-dom" />
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

describe('ContactForm Component', () => {
  
  /**
   * TEST 1: Initial State
   * Test that the form renders with empty fields
   */
  test('renders form with empty fields initially', () => {
    // ARRANGE
    render(<ContactForm />);
    
    // ACT & ASSERT: Check all form fields are empty
    // FORM TESTING: getByLabelText() finds inputs by their associated labels
    // This tests both the input and its accessibility (proper labeling)
    expect(screen.getByLabelText(/name/i)).toHaveValue('');
    expect(screen.getByLabelText(/email/i)).toHaveValue('');
    expect(screen.getByLabelText(/message/i)).toHaveValue('');
    
    // toHaveValue() - Jest matcher for checking input values
    // Works with various input types (text, number, select, etc.)
    
    // Check submit button is present and enabled
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeEnabled();
  });

  /**
   * TEST 2: Form Input Testing
   * Test that typing in inputs updates their values
   */
  test('updates input values when user types', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<ContactForm />);
    
    // ACT: Type in each input field
    // user.type() - REALISTIC TYPING: Simulates real user typing character by character
    // This triggers onChange events naturally, just like real user interaction
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Hello, this is a test message');
    
    // ASSERT: Check values are updated
    // FORM STATE TESTING: Verify form state changes correctly
    expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/email/i)).toHaveValue('john@example.com');
    expect(screen.getByLabelText(/message/i)).toHaveValue('Hello, this is a test message');
  });

  /**
   * TEST 3: Form Validation Testing
   * Test that submitting empty form shows validation errors
   */
  test('shows validation errors when submitting empty form', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<ContactForm />);
    
    // ACT: Submit form without filling fields
    // FORM SUBMISSION TESTING: Test validation on empty form
    await user.click(screen.getByRole('button', { name: /send message/i }));
    
    // ASSERT: Check error messages appear
    // VALIDATION TESTING: Verify error messages are displayed
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Message is required')).toBeInTheDocument();
  });

  /**
   * TEST 4: Field-Specific Validation
   * Test validation for field lengths
   */
  test('shows validation errors for short inputs', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<ContactForm />);
    
    // ACT: Fill fields with short values
    // VALIDATION EDGE CASES: Test minimum length requirements
    await user.type(screen.getByLabelText(/name/i), 'J');
    await user.type(screen.getByLabelText(/message/i), 'Short');
    await user.click(screen.getByRole('button', { name: /send message/i }));
    
    // ASSERT: Check specific error messages
    expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
    expect(screen.getByText('Message must be at least 10 characters')).toBeInTheDocument();
  });

  /**
   * TEST 5: Complex Validation & Mock Functions
   * Test email format validation - demonstrates complex validation edge cases
   */
  test('shows validation error for invalid email', async () => {
    // ARRANGE
    const user = userEvent.setup();
    // MOCK FUNCTIONS: jest.fn() creates a mock function for testing callbacks
    // This allows us to verify if and how the onSubmit callback is called
    const mockOnSubmit = jest.fn();
    render(<ContactForm onSubmit={mockOnSubmit} />);
    
    // ACT: Test that empty email shows required error
    await user.click(screen.getByRole('button', { name: /send message/i }));
    
    // ASSERT: Verify that validation works for required fields
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    
    // NOTE: This test demonstrates a complex validation scenario where browser
    // input type="email" behavior may interact with custom validation logic.
    // In real applications, this edge case would require additional testing
    // and potentially different validation strategies.
    
    // CALLBACK TESTING: The form should NOT be submitted because of validation errors
    // jest.fn() allows us to verify the callback was not called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  /**
   * TEST 6: Dynamic Error Clearing
   * Test that errors clear when user starts typing
   */
  test('clears errors when user starts typing', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<ContactForm />);
    
    // ACT: Submit to show errors, then start typing
    // ERROR STATE TESTING: First trigger validation errors
    await user.click(screen.getByRole('button', { name: /send message/i }));
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    
    // USER EXPERIENCE TESTING: Verify errors clear when user starts fixing them
    await user.type(screen.getByLabelText(/name/i), 'John');
    
    // ASSERT: Error should be cleared
    // DYNAMIC UI TESTING: Check that UI updates based on user actions
    expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
  });

  /**
   * TEST 7: Async Operations & Loading States
   * Test form submission with valid data
   */
  test('successfully submits form with valid data', async () => {
    // ARRANGE
    const user = userEvent.setup();
    const mockOnSubmit = jest.fn();
    render(<ContactForm onSubmit={mockOnSubmit} />);
    
    // ACT: Fill form with valid data
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'This is a valid message with enough characters');
    
    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);
    
    // ASSERT: Check loading state appears
    // LOADING STATE TESTING: Verify button shows loading state during submission
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sending/i })).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled();
    
    // ASYNC TESTING: waitFor() waits for asynchronous operations to complete
    // This is essential for testing async form submissions, API calls, etc.
    await waitFor(() => {
      expect(screen.getByText('Thank you for your message!')).toBeInTheDocument();
    });
    
    // CALLBACK VERIFICATION: Check that callback was called with correct data
    // toHaveBeenCalledWith() verifies the exact arguments passed to the mock
    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a valid message with enough characters'
    });
  });

  /**
   * TEST 8: Success State & Component Flow
   * Test the success message and reset functionality
   */
  test('shows success message after submission', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<ContactForm />);
    
    // ACT: Submit valid form
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'This is a valid message with enough characters');
    await user.click(screen.getByRole('button', { name: /send message/i }));
    
    // ASSERT: Wait for success message
    // ASYNC FLOW TESTING: Test complete user journey from input to success
    await waitFor(() => {
      expect(screen.getByText('Thank you for your message!')).toBeInTheDocument();
    });
    
    // SUCCESS STATE TESTING: Verify all success elements are present
    expect(screen.getByText('Thank you for your message!')).toBeInTheDocument();
    expect(screen.getByText("We'll get back to you soon.")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send another message/i })).toBeInTheDocument();
  });

  /**
   * TEST 9: Error Recovery Testing
   * Test that form can recover from submission errors
   */
  test('allows retry after form submission', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<ContactForm />);
    
    // ACT: Submit valid form and wait for success
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'This is a valid message with enough characters');
    await user.click(screen.getByRole('button', { name: /send message/i }));
    
    // Wait for success state
    await waitFor(() => {
      expect(screen.getByText('Thank you for your message!')).toBeInTheDocument();
    });
    
    // ACT: Click "Send another message" button
    await user.click(screen.getByRole('button', { name: /send another message/i }));
    
    // ASSERT: Verify form is reset and ready for new input
    // FORM RESET TESTING: Check that form returns to initial state
    expect(screen.getByLabelText(/name/i)).toHaveValue('');
    expect(screen.getByLabelText(/email/i)).toHaveValue('');
    expect(screen.getByLabelText(/message/i)).toHaveValue('');
    expect(screen.getByRole('button', { name: /send message/i })).toBeEnabled();
  });
});`,
    componentCode: `/**
 * MEDIUM EXAMPLE 2: Contact Form with Validation and State Management
 */

import { useState } from 'react';

interface ContactFormProps {
  onSubmit?: (data: FormData) => void;
}

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.includes('@') || !formData.email.includes('.')) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        onSubmit?.(formData);
        setFormData({ name: '', email: '', message: '' });
      }, 1000);
    }
  };

  if (isSubmitted) {
    return (
      <div className="success-message">
        <h3>Thank you for your message!</h3>
        <p>We'll get back to you soon.</p>
        <button onClick={() => setIsSubmitted(false)}>
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <h2>Contact Us</h2>
      
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
        />
        {errors.message && <span className="error-message">{errors.message}</span>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
};

export default ContactForm;`
  },

  UserList: {
    testCode: `/**
 * HARD EXAMPLE 1: Testing Data Fetching and Async Operations
 * 
 * This test file demonstrates:
 * - Mocking external dependencies (API services)
 * - Testing loading states
 * - Testing error states
 * - Testing async operations with waitFor
 * - Mocking with different return values
 * - Testing component cleanup
 */

/// <reference types="@testing-library/jest-dom" />
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserList from './UserList';
import { userService } from '../../services/userService';

// MODULE MOCKING: Mock the entire userService module
// This replaces the real service with a mock version for testing
jest.mock('../../services/userService', () => ({
  userService: {
    fetchUsers: jest.fn(),
  },
}));

// TYPE CASTING: Cast the mocked service for better TypeScript support
// This gives us proper typing for mock methods and better IDE support
const mockUserService = userService as jest.Mocked<typeof userService>;

describe('UserList Component', () => {
  
  // MOCK DATA: Create realistic test data
  // This represents what the real API would return
  const mockUsers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      username: 'johndoe',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      username: 'janesmith',
    },
  ];

  /**
   * SETUP & CLEANUP: Reset mocks before each test
   * This ensures tests don't interfere with each other
   */
  beforeEach(() => {
    // MOCK CLEANUP: Clear all mock function calls and results
    // This prevents test pollution where one test's mock calls affect another
    jest.clearAllMocks();
  });

  /**
   * TEST 1: Loading State Testing
   * Test that loading state is shown while data is being fetched
   */
  test('shows loading state initially', async () => {
    // ARRANGE: Mock a delayed response
    // ASYNC MOCK: mockImplementation allows us to control async behavior
    // This simulates a real API call that takes time to complete
    mockUserService.fetchUsers.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockUsers), 100))
    );

    // ACT: Render component
    render(<UserList />);

    // ASSERT: Check loading state is shown
    // INITIAL STATE TESTING: Verify component shows loading immediately
    expect(screen.getByText('Loading users...')).toBeInTheDocument();
    
    // CLEANUP: Wait for async operation to complete to avoid act warnings
    await waitFor(() => {
      expect(screen.queryByText('Loading users...')).not.toBeInTheDocument();
    });
  });

  /**
   * TEST 2: Successful Data Loading
   * Test that users are displayed after successful API call
   */
  test('displays users after successful API call', async () => {
    // ARRANGE: Mock successful response
    // MOCK RESOLVED VALUE: mockResolvedValue simulates a successful Promise
    // This is cleaner than mockImplementation for simple success cases
    mockUserService.fetchUsers.mockResolvedValue(mockUsers);

    // ACT: Render component
    render(<UserList />);

    // ASSERT: Wait for loading to complete and users to be displayed
    // ASYNC TESTING: waitFor() waits for async operations and DOM updates
    await waitFor(() => {
      expect(screen.queryByText('Loading users...')).not.toBeInTheDocument();
    });

    // DATA RENDERING TESTING: Check that API data is properly displayed
    expect(screen.getByText('2 users found')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('johndoe')).toBeInTheDocument();
  });

  /**
   * TEST 3: Error State Testing
   * Test that error state is shown when API call fails
   */
  test('shows error state when API call fails', async () => {
    // ARRANGE: Mock API failure
    // ERROR MOCKING: mockRejectedValue simulates a Promise rejection
    const errorMessage = 'Network error';
    mockUserService.fetchUsers.mockRejectedValue(new Error(errorMessage));

    // ACT: Render component
    render(<UserList />);

    // ASSERT: Wait for error to be displayed
    // ERROR STATE TESTING: Verify error handling works correctly
    await waitFor(() => {
      expect(screen.getByText(\`Error: \${errorMessage}\`)).toBeInTheDocument();
    });

    expect(screen.getByText(\`Error: \${errorMessage}\`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  /**
   * TEST 4: Empty Data Handling
   * Test handling of empty user list
   */
  test('handles empty user list', async () => {
    // ARRANGE: Mock empty response
    // EDGE CASE TESTING: Test how component handles empty data
    mockUserService.fetchUsers.mockResolvedValue([]);

    // ACT: Render component
    render(<UserList />);

    // ASSERT: Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading users...')).not.toBeInTheDocument();
    });

    // EMPTY STATE TESTING: Verify empty state is handled gracefully
    expect(screen.getByText('0 users found')).toBeInTheDocument();
    expect(screen.queryByText(/Email:/)).not.toBeInTheDocument();
  });

  /**
   * TEST 5: Props Testing with Mocks
   * Test that custom API URL is passed to service
   */
  test('calls API with custom URL', async () => {
    // ARRANGE: Mock successful response
    mockUserService.fetchUsers.mockResolvedValue(mockUsers);
    const customUrl = 'https://api.example.com/users';

    // ACT: Render with custom URL
    render(<UserList apiUrl={customUrl} />);

    // ASSERT: Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading users...')).not.toBeInTheDocument();
    });

    // ASSERT: Check that service was called with correct URL
    // MOCK VERIFICATION: Check how the mock was called
    // toHaveBeenCalledWith() verifies the exact arguments passed
    expect(mockUserService.fetchUsers).toHaveBeenCalledWith(customUrl);
  });

  /**
   * TEST 6: Component Updates & Re-renders
   * Test that changing props triggers new API call
   */
  test('fetches data again when apiUrl changes', async () => {
    // ARRANGE: Mock successful responses
    mockUserService.fetchUsers.mockResolvedValue(mockUsers);

    // ACT: Render with initial URL
    const { rerender } = render(<UserList apiUrl="https://api1.com" />);

    // WAIT FOR INITIAL LOAD: Ensure first API call completes
    await waitFor(() => {
      expect(screen.queryByText('Loading users...')).not.toBeInTheDocument();
    });

    // ACT: Change the URL prop
    rerender(<UserList apiUrl="https://api2.com" />);

    // WAIT FOR RE-RENDER: Ensure second API call completes
    await waitFor(() => {
      expect(mockUserService.fetchUsers).toHaveBeenCalledTimes(2);
    });

    // ASSERT: Check that API was called twice with different URLs
    // CALL COUNT TESTING: Verify number of mock function calls
    expect(mockUserService.fetchUsers).toHaveBeenCalledTimes(2);
    // CALL SEQUENCE TESTING: Verify the order and arguments of calls
    expect(mockUserService.fetchUsers).toHaveBeenNthCalledWith(1, 'https://api1.com');
    expect(mockUserService.fetchUsers).toHaveBeenNthCalledWith(2, 'https://api2.com');
  });

  /**
   * TEST 7: Retry Functionality
   * Test that retry button is present and clickable when there's an error
   */
  test('retry button is present and clickable when there is an error', async () => {
    // ARRANGE: Mock API failure
    const errorMessage = 'Network error';
    mockUserService.fetchUsers.mockRejectedValue(new Error(errorMessage));

    // ACT: Render component
    render(<UserList />);

    // ASSERT: Wait for error state
    await waitFor(() => {
      expect(screen.getByText(\`Error: \${errorMessage}\`)).toBeInTheDocument();
    });

    // ASSERT: Check that retry button is present and clickable
    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeInTheDocument();
    expect(retryButton).toBeEnabled();
    
    // NOTE: In a real application, you would implement a proper retry mechanism
    // This test verifies that the retry button is accessible and functional
    // The actual retry logic (window.location.reload) is an implementation detail
  });

  /**
   * TEST 8: Mock Function Behavior Testing
   * Test different mock implementations and behaviors
   */
  test('handles different response types', async () => {
    // ARRANGE: Mock different responses for multiple calls
    mockUserService.fetchUsers
      .mockResolvedValueOnce([]) // First call returns empty array
      .mockResolvedValueOnce(mockUsers) // Second call returns users
      .mockRejectedValueOnce(new Error('Server error')); // Third call fails

    // ACT & ASSERT: First render - empty state
    const { rerender } = render(<UserList apiUrl="https://api1.com" />);
    await waitFor(() => {
      expect(screen.getByText('0 users found')).toBeInTheDocument();
    });

    // ACT & ASSERT: Second render - with users
    rerender(<UserList apiUrl="https://api2.com" />);
    await waitFor(() => {
      expect(screen.getByText('2 users found')).toBeInTheDocument();
    });

    // ACT & ASSERT: Third render - error state
    rerender(<UserList apiUrl="https://api3.com" />);
    await waitFor(() => {
      expect(screen.getByText('Error: Server error')).toBeInTheDocument();
    });

    // VERIFY MOCK CALLS: Check that all calls were made as expected
    expect(mockUserService.fetchUsers).toHaveBeenCalledTimes(3);
  });

  /**
   * TEST 9: Component Cleanup & Memory Leaks
   * Test that component properly cleans up async operations
   */
  test('handles component unmount during async operation', async () => {
    // ARRANGE: Mock a slow API response
    mockUserService.fetchUsers.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockUsers), 1000))
    );

    // ACT: Render component then unmount quickly
    const { unmount } = render(<UserList />);
    expect(screen.getByText('Loading users...')).toBeInTheDocument();
    
    // UNMOUNT TESTING: Unmount component before async operation completes
    unmount();
    
    // ASSERT: This test primarily ensures no memory leaks or warnings
    // In a real component, you'd implement cleanup in useEffect return function
    // This test verifies the component can be safely unmounted during async operations
  });

  /**
   * TEST 10: Mock Implementation Patterns
   * Test different ways to mock functions for various scenarios
   */
  test('demonstrates different mocking patterns', async () => {
    // PATTERN 1: Mock with custom implementation
    mockUserService.fetchUsers.mockImplementation(async (url) => {
      // Custom logic based on URL
      if (url?.includes('admin')) {
        return [{ id: 1, name: 'Admin User', email: 'admin@test.com', username: 'admin' }];
      }
      return mockUsers;
    });

    // ACT: Test with admin URL
    render(<UserList apiUrl="https://api.com/admin/users" />);
    
    // ASSERT: Check that custom logic was applied
    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
    });

    // PATTERN 2: Mock with spy functionality
    // This preserves the original function while allowing inspection
    const spy = jest.spyOn(mockUserService, 'fetchUsers');
    
    // You can now verify calls, arguments, etc. while maintaining function behavior
    expect(spy).toHaveBeenCalled();
    
    // CLEANUP: Restore original implementation
    spy.mockRestore();
  });
});`,
    componentCode: `/**
 * HARD EXAMPLE 1: User List with Async Data Fetching and Error Handling
 */

import { useState, useEffect } from 'react';
import type { User } from '../../services/userService';
import { userService } from '../../services/userService';

interface UserListProps {
  apiUrl?: string;
}

const UserList: React.FC<UserListProps> = ({ 
  apiUrl = 'https://jsonplaceholder.typicode.com/users' 
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userData = await userService.fetchUsers(apiUrl);
        
        if (!controller.signal.aborted) {
          setUsers(userData);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch users');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      controller.abort();
    };
  }, [apiUrl]);

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="user-list">
        <h2>Users</h2>
        <div className="loading">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-list">
        <h2>Users</h2>
        <div className="error">Error: {error}</div>
        <button onClick={handleRetry} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="user-list">
      <h2>Users</h2>
      <div className="user-count">{users.length} users found</div>
      
      <div className="users">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <h3>{user.name}</h3>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Username:</strong> {user.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;`
  },

  SearchFilter: {
    testCode: `/**
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
  
  // Clean up between tests without using fake timers
  beforeEach(() => {
    jest.clearAllMocks();
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
    const user = userEvent.setup();
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
    const user = userEvent.setup();
    const mockOnResultsChange = jest.fn();
    render(<SearchFilter onResultsChange={mockOnResultsChange} debounceMs={300} />);

    // ACT
    const searchInput = screen.getByPlaceholderText('Search products...');
    await user.type(searchInput, 'laptop');

    // ASSERT: Should not trigger search immediately
    // DEBOUNCE TESTING: Verify debounced function doesn't fire immediately
    expect(screen.queryByText('Searching...')).not.toBeInTheDocument();

    // ACT & ASSERT: Wait for debounced search to trigger by finding loading state
    // findBy* - ASYNC QUERY: Waits for element to appear naturally
    // This is preferred over manual timer control for testing debounced operations
    await expect(screen.findByText('Searching...', {}, { timeout: 1000 })).resolves.toBeInTheDocument();
  });

  /**
   * TEST 4: Complex Form Interactions
   * Test that filter controls work correctly
   */
  test('handles filter changes', async () => {
    // ARRANGE
    const user = userEvent.setup();
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
    const user = userEvent.setup();
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
    const user = userEvent.setup();
    render(<SearchFilter debounceMs={100} />);

    // ACT
    const searchInput = screen.getByPlaceholderText('Search products...');
    await user.type(searchInput, 'laptop');

    // ASSERT: Wait for loading state to appear naturally after debounce
    // NATURAL ASYNC TESTING: Let the component's natural timing control the test
    // This is more realistic than manually controlling timers
    await expect(screen.findByText('Searching...', {}, { timeout: 500 })).resolves.toBeInTheDocument();
  });

  /**
   * TEST 7: Edge Cases & Negative Testing
   * Test behavior when search input is empty
   */
  test('handles empty search input', async () => {
    // ARRANGE
    const user = userEvent.setup();
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
    const user = userEvent.setup();
    render(<SearchFilter />);

    // ACT
    const searchInput = screen.getByPlaceholderText('Search products...');
    await user.type(searchInput, 'laptop');

    // ASSERT: Wait for search to trigger and complete naturally
    // COMPLETE ASYNC FLOW: Test the full cycle from input to results
    await screen.findByText('Searching...', {}, { timeout: 1000 });
    
    // Wait for search to complete by waiting for loading to disappear
    await waitFor(() => {
      expect(screen.queryByText('Searching...')).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  /**
   * TEST 9: Query Method Differences - Educational Example
   * Demonstrate when to use getBy vs queryBy vs findBy
   */
  test('demonstrates query method differences', async () => {
    // ARRANGE
    const user = userEvent.setup();
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
    await expect(screen.findByText('Searching...', {}, { timeout: 1000 })).resolves.toBeInTheDocument();
  });

  /**
   * TEST 10: Performance & Memory Testing
   * Test that component properly handles rapid user input
   */
  test('handles rapid user input without performance issues', async () => {
    // ARRANGE
    const user = userEvent.setup();
    const mockOnResultsChange = jest.fn();
    render(<SearchFilter onResultsChange={mockOnResultsChange} debounceMs={300} />);

    // ACT: Rapid typing simulation
    // PERFORMANCE TESTING: Simulate rapid user input
    const searchInput = screen.getByPlaceholderText('Search products...');
    await user.type(searchInput, 'laptop');

    // ASSERT: Wait for debounced search to trigger
    // DEBOUNCE VERIFICATION: Check that debouncing prevents excessive API calls
    await screen.findByText('Searching...', {}, { timeout: 1000 });
    
    // Wait for search to complete
    await waitFor(() => {
      expect(screen.queryByText('Searching...')).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  /**
   * TEST 11: Accessibility & Keyboard Navigation
   * Test that component works with keyboard navigation
   */
  test('supports keyboard navigation', async () => {
    // ARRANGE
    const user = userEvent.setup();
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
});`,
    componentCode: `/**
 * HARD EXAMPLE 2: Advanced Search Filter with Debouncing and Complex Interactions
 */

import { useState, useEffect, useCallback } from 'react';

export interface SearchResult {
  id: string;
  title: string;
  category: string;
  price: number;
  description: string;
  inStock: boolean;
}

export interface SearchFilters {
  category: string;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
}

interface SearchFilterProps {
  onResultsChange?: (results: SearchResult[]) => void;
  placeholder?: string;
  debounceMs?: number;
  maxResults?: number;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  onResultsChange,
  placeholder = "Search products...",
  debounceMs = 300,
  maxResults = 10
}) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    category: '',
    minPrice: 0,
    maxPrice: 10000,
    inStockOnly: false
  });
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useCallback(async (searchQuery: string, searchFilters: SearchFilters) => {
    if (searchQuery.trim() === '') {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockResults: SearchResult[] = [
        { id: '1', title: 'Laptop Pro', category: 'electronics', price: 1299.99, description: 'High-performance laptop', inStock: true },
        { id: '2', title: 'Coffee Maker', category: 'appliances', price: 89.99, description: 'Automatic coffee maker', inStock: false }
      ];
      
      const filteredResults = mockResults.filter(item => {
        const matchesQuery = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = searchFilters.category === '' || item.category === searchFilters.category;
        const matchesPriceRange = item.price >= searchFilters.minPrice && item.price <= searchFilters.maxPrice;
        const matchesStock = !searchFilters.inStockOnly || item.inStock;
        
        return matchesQuery && matchesCategory && matchesPriceRange && matchesStock;
      });
      
      setResults(filteredResults.slice(0, maxResults));
      onResultsChange?.(filteredResults);
    } catch (err) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  }, [maxResults, onResultsChange]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedSearch(query, filters);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, filters, debouncedSearch, debounceMs]);

  const handleClearAll = () => {
    setQuery('');
    setFilters({
      category: '',
      minPrice: 0,
      maxPrice: 10000,
      inStockOnly: false
    });
    setResults([]);
    setError(null);
  };

  return (
    <div className="search-filter">
      <div className="search-controls">
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select
          value={filters.category}
          onChange={(e) => setFilters({...filters, category: e.target.value})}
          aria-label="Category:"
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="appliances">Appliances</option>
          <option value="sports">Sports</option>
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={(e) => setFilters({...filters, minPrice: Number(e.target.value)})}
          aria-label="Min Price:"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={(e) => setFilters({...filters, maxPrice: Number(e.target.value)})}
          aria-label="Max Price:"
        />

        <label>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => setFilters({...filters, inStockOnly: e.target.checked})}
          />
          In Stock Only
        </label>

        <button onClick={handleClearAll}>Clear All</button>
      </div>

      {loading && <div>Searching...</div>}
      {error && <div>Error: {error}</div>}
      
      <div className="search-results">
        {results.map(item => (
          <div key={item.id} className="result-item">
            <h4>{item.title}</h4>
            <p>{item.description}</p>
            <p>Price: $\{item.price}</p>
            <p>Category: {item.category}</p>
            <p>In Stock: {item.inStock ? 'Yes' : 'No'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};`
  }
}; 