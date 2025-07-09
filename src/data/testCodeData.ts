/**
 * Test Code Data
 * 
 * This file contains all the test code strings for each component.
 * The test code is stored as strings to be displayed in the TestCodeViewer component.
 */

export const testCodeData = {
  Greeting: `/**
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
});`,

  UserCard: `/**
 * EASY EXAMPLE 2: Testing Props and Conditional Rendering
 * 
 * This test file demonstrates:
 * - Testing components with multiple props
 * - Testing conditional rendering
 * - Using data-testid for reliable element selection
 * - Testing CSS classes
 * - Testing default prop values
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserCard from './UserCard';

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
    
    // Check that optional fields are NOT rendered when not provided
    expect(screen.queryByText(/Email:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Age:/)).not.toBeInTheDocument();
  });

  /**
   * TEST 2: All Props Provided
   * Test the component with all possible props
   */
  test('renders with all props provided', () => {
    // ARRANGE: Render with all props
    const props = {
      name: 'Jane Smith',
      email: 'jane@example.com',
      age: 25,
      isActive: true
    };
    
    render(<UserCard {...props} />);
    
    // ACT & ASSERT: Check all elements are present
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Email: jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('Age: 25 years old')).toBeInTheDocument();
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
    expect(screen.queryByText('🟢 Active')).not.toBeInTheDocument();
  });

  /**
   * TEST 4: CSS Classes
   * Test that the correct CSS classes are applied
   */
  test('applies correct CSS classes for active user', () => {
    // ARRANGE
    render(<UserCard name="Test User" isActive={true} />);
    
    // ACT & ASSERT: Check CSS classes on the container
    const container = screen.getByText('Test User').closest('.user-card');
    expect(container).toHaveClass('user-card', 'active');
    expect(container).not.toHaveClass('inactive');
  });
});`,

  ItemList: `/**
 * EASY EXAMPLE 3: Testing List Rendering
 * 
 * This test file demonstrates:
 * - Testing components that render lists
 * - Testing empty states
 * - Using getAllByTestId() for multiple elements
 * - Testing array lengths and content
 * - Testing default props
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ItemList from './ItemList';

describe('ItemList Component', () => {
  
  /**
   * TEST 1: Empty List
   * Test how the component handles an empty array
   */
  test('renders empty message when no items provided', () => {
    // ARRANGE: Render with empty array
    render(<ItemList items={[]} />);
    
    // ACT & ASSERT: Check empty state
    expect(screen.getByText('No items to display')).toBeInTheDocument();
    
    // Check that no list is rendered
    const componentOutput = screen.getByText('No items to display').closest('.component-output');
    expect(componentOutput).not.toBeNull();
    expect(componentOutput!.querySelector('ul')).not.toBeInTheDocument();
    
    // Check item count shows 0
    expect(screen.getByText('Total items: 0')).toBeInTheDocument();
  });

  /**
   * TEST 2: Multiple Items
   * Test rendering with multiple items
   */
  test('renders multiple items correctly', () => {
    // ARRANGE: Render with multiple items
    const items = ['Apple', 'Banana', 'Cherry', 'Date'];
    render(<ItemList items={items} />);
    
    // ACT & ASSERT: Check all items are rendered
    const componentOutput = screen.getByText('Apple').closest('.component-output');
    expect(componentOutput).not.toBeNull();
    const listItems = componentOutput!.querySelectorAll('li');
    expect(listItems).toHaveLength(4);
    
    // Check each item content
    expect(listItems[0]).toHaveTextContent('Apple');
    expect(listItems[1]).toHaveTextContent('Banana');
    expect(listItems[2]).toHaveTextContent('Cherry');
    expect(listItems[3]).toHaveTextContent('Date');
    
    // Check item count
    expect(screen.getByText('Total items: 4')).toBeInTheDocument();
  });

  /**
   * TEST 3: Custom Title
   * Test custom title prop
   */
  test('renders custom title', () => {
    // ARRANGE: Render with custom title
    const customTitle = 'My Favorite Foods';
    render(<ItemList items={['Pizza']} title={customTitle} />);
    
    // ACT & ASSERT: Check custom title appears
    const componentOutput = screen.getByText(customTitle).closest('.component-output');
    expect(componentOutput).not.toBeNull();
    const heading = componentOutput!.querySelector('h3');
    expect(heading).toHaveTextContent(customTitle);
  });
});`,

  Counter: `/**
 * MEDIUM EXAMPLE 1: Testing State Management and User Interactions
 * 
 * This test file demonstrates:
 * - Testing user interactions with fireEvent
 * - Testing state changes and updates
 * - Testing disabled states
 * - Testing edge cases and boundaries
 * - Testing component re-renders
 */

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
   * TEST 4: Boundary Testing (Min/Max)
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

  /**
   * TEST 5: Button Disabled States
   * Test that buttons are disabled when appropriate
   */
  test('disables increment button when at maximum', () => {
    // ARRANGE: Start at maximum
    render(<Counter initialCount={10} max={10} />);
    
    // ACT & ASSERT: Increment button should be disabled
    const incrementButton = screen.getByRole('button', { name: /increase count/i });
    expect(incrementButton).toBeDisabled();
  });
});`,

  ContactForm: `/**
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
    expect(screen.getByLabelText(/name/i)).toHaveValue('');
    expect(screen.getByLabelText(/email/i)).toHaveValue('');
    expect(screen.getByLabelText(/message/i)).toHaveValue('');
    
    // Check submit button is present and enabled
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeEnabled();
  });

  /**
   * TEST 2: Input Changes
   * Test that typing in inputs updates their values
   */
  test('updates input values when user types', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<ContactForm />);
    
    // ACT: Type in each input field
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Hello, this is a test message');
    
    // ASSERT: Check values are updated
    expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/email/i)).toHaveValue('john@example.com');
    expect(screen.getByLabelText(/message/i)).toHaveValue('Hello, this is a test message');
  });

  /**
   * TEST 3: Form Validation - Required Fields
   * Test that submitting empty form shows validation errors
   */
  test('shows validation errors when submitting empty form', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<ContactForm />);
    
    // ACT: Submit form without filling fields
    await user.click(screen.getByRole('button', { name: /send message/i }));
    
    // ASSERT: Check error messages appear
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Message is required')).toBeInTheDocument();
  });

  /**
   * TEST 4: Successful Form Submission
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
    
    // ASSERT: Check loading state
    expect(screen.getByRole('button', { name: /sending/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled();
    
    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText('Thank you for your message!')).toBeInTheDocument();
    });
    
    // Check callback was called
    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a valid message with enough characters'
    });
  });
});`,

  UserList: `/**
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

import { render, screen, waitFor } from '@testing-library/react';
import UserList from './UserList';
import { userService } from '../../services/userService';

// Mock the userService module
jest.mock('../../services/userService', () => ({
  userService: {
    fetchUsers: jest.fn(),
  },
}));

// Type the mocked service for better TypeScript support
const mockUserService = userService as jest.Mocked<typeof userService>;

describe('UserList Component', () => {
  
  // Mock data for testing
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
   * Reset mocks before each test
   * This ensures tests don't interfere with each other
   */
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * TEST 1: Loading State
   * Test that loading state is shown while data is being fetched
   */
  test('shows loading state initially', async () => {
    // ARRANGE: Mock a delayed response
    mockUserService.fetchUsers.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockUsers), 100))
    );

    // ACT: Render component
    render(<UserList />);

    // ASSERT: Check loading state is shown
    expect(screen.getByText('Loading users...')).toBeInTheDocument();
  });

  /**
   * TEST 2: Successful Data Loading
   * Test that users are displayed after successful API call
   */
  test('displays users after successful API call', async () => {
    // ARRANGE: Mock successful response
    mockUserService.fetchUsers.mockResolvedValue(mockUsers);

    // ACT: Render component
    render(<UserList />);

    // ASSERT: Wait for loading to complete and users to be displayed
    await waitFor(() => {
      expect(screen.queryByText('Loading users...')).not.toBeInTheDocument();
    });

    // Check that users are displayed
    expect(screen.getByText('2 users found')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  /**
   * TEST 3: Error State
   * Test that error state is shown when API call fails
   */
  test('shows error state when API call fails', async () => {
    // ARRANGE: Mock API failure
    const errorMessage = 'Network error';
    mockUserService.fetchUsers.mockRejectedValue(new Error(errorMessage));

    // ACT: Render component
    render(<UserList />);

    // ASSERT: Wait for error to be displayed
    await waitFor(() => {
      expect(screen.getByText(\`Error: \${errorMessage}\`)).toBeInTheDocument();
    });
  });

  /**
   * TEST 4: Empty Results
   * Test handling of empty user list
   */
  test('handles empty user list', async () => {
    // ARRANGE: Mock empty response
    mockUserService.fetchUsers.mockResolvedValue([]);

    // ACT: Render component
    render(<UserList />);

    // ASSERT: Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading users...')).not.toBeInTheDocument();
    });

    // Check empty state
    expect(screen.getByText('0 users found')).toBeInTheDocument();
  });
});`,

  SearchFilter: `/**
 * HARD EXAMPLE 2: Testing Complex Search and Filter Component
 * 
 * This test file demonstrates advanced testing concepts:
 * - Testing debounced user input
 * - Mocking complex async operations
 * - Testing multiple interactive filters
 * - Testing error handling and retry mechanisms
 * - Testing performance optimizations
 * - Testing complex state management
 */

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
   * TEST 3: Debouncing
   * Test that search is debounced to avoid excessive API calls
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

    // ACT: Advance timers to trigger debounced search
    jest.advanceTimersByTime(300);

    // ASSERT: Should now show loading state
    await waitFor(() => {
      expect(screen.getByText('Searching...')).toBeInTheDocument();
    });
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
   * TEST 6: Loading States
   * Test that loading states are properly displayed
   */
  test('shows loading state during search', async () => {
    // ARRANGE
    const user = userEvent.setup({ delay: null });
    render(<SearchFilter debounceMs={100} />);

    // ACT
    const searchInput = screen.getByPlaceholderText('Search products...');
    await user.type(searchInput, 'laptop');

    // Advance timers to trigger search
    jest.advanceTimersByTime(100);

    // ASSERT
    await waitFor(() => {
      expect(screen.getByText('Searching...')).toBeInTheDocument();
    });
  });
});`
}; 