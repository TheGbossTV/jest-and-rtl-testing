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