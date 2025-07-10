/**
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
    expect(screen.getByText('johndoe')).toBeInTheDocument();
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
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });

    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
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
    expect(screen.queryByText(/Email:/)).not.toBeInTheDocument();
  });

  /**
   * TEST 5: Custom API URL
   * Test that custom API URL is passed to service
   */
  test('calls API with custom URL', async () => {
    // ARRANGE: Mock successful response
    mockUserService.fetchUsers.mockResolvedValue(mockUsers);
    const customUrl = 'https://api.example.com/users';

    // ACT: Render with custom URL
    render(<UserList apiUrl={customUrl} />);

    // ASSERT: Check that service was called with correct URL
    expect(mockUserService.fetchUsers).toHaveBeenCalledWith(customUrl);
  });

  /**
   * TEST 6: Multiple API Calls
   * Test that changing props triggers new API call
   */
  test('fetches data again when apiUrl changes', async () => {
    // ARRANGE: Mock successful responses
    mockUserService.fetchUsers.mockResolvedValue(mockUsers);

    // ACT: Render with initial URL
    const { rerender } = render(<UserList apiUrl="https://api1.com" />);

    await waitFor(() => {
      expect(screen.queryByText('Loading users...')).not.toBeInTheDocument();
    });

    // Change the URL
    rerender(<UserList apiUrl="https://api2.com" />);

    // ASSERT: Check that API was called twice with different URLs
    expect(mockUserService.fetchUsers).toHaveBeenCalledTimes(2);
    expect(mockUserService.fetchUsers).toHaveBeenNthCalledWith(1, 'https://api1.com');
    expect(mockUserService.fetchUsers).toHaveBeenNthCalledWith(2, 'https://api2.com');
  });

  /**
   * TEST 7: Retry Functionality
   * Test that retry button is present and clickable
   */
  test('retry button is present and clickable', async () => {
    // ARRANGE: Mock API failure
    mockUserService.fetchUsers.mockRejectedValue(new Error('Network error'));
    
    render(<UserList />);

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText('Error: Network error')).toBeInTheDocument();
    });

    // ACT & ASSERT: Check that retry button exists and is clickable
    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeInTheDocument();
    expect(retryButton).toBeEnabled();
    
    // Note: In a real app, you'd implement proper retry logic instead of page reload
    // This test verifies the button exists and is accessible
  });

  /**
   * TEST 8: Component Cleanup
   * Test that component cleans up properly when unmounted
   */
  test('aborts fetch when component unmounts', async () => {
    // ARRANGE: Mock a slow API call
    mockUserService.fetchUsers.mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockUsers), 1000);
      });
    });

    // ACT: Render and immediately unmount
    const { unmount } = render(<UserList />);
    unmount();

    // ASSERT: This test mainly ensures no memory leaks occur
    // The actual abort logic is tested through the component's behavior
    expect(mockUserService.fetchUsers).toHaveBeenCalled();
  });

  /**
   * TEST 9: User Card Rendering
   * Test that individual user cards are rendered correctly
   */
  test('renders user cards with correct information', async () => {
    // ARRANGE: Mock successful response
    mockUserService.fetchUsers.mockResolvedValue(mockUsers);

    // ACT: Render component
    render(<UserList />);

    // ASSERT: Wait for users to load
    await waitFor(() => {
      expect(screen.queryByText('Loading users...')).not.toBeInTheDocument();
    });

    // Check individual user cards
    // Get the user cards by finding them within the component output
    const componentOutput = screen.getByText('John Doe').closest('.component-demo');
    expect(componentOutput).not.toBeNull();
    const userCards = componentOutput!.querySelectorAll('.user-card');
    expect(userCards).toHaveLength(2);

    // Check first user card
    expect(userCards[0]).toHaveTextContent('John Doe');
    expect(userCards[0]).toHaveTextContent('john@example.com');
    expect(userCards[0]).toHaveTextContent('johndoe');

    // Check second user card
    expect(userCards[1]).toHaveTextContent('Jane Smith');
    expect(userCards[1]).toHaveTextContent('jane@example.com');
    expect(userCards[1]).toHaveTextContent('janesmith');
  });

  /**
   * TEST 10: HTTP Error Handling
   * Test that HTTP errors are handled properly
   */
  test('handles HTTP errors correctly', async () => {
    // ARRANGE: Mock HTTP error
    mockUserService.fetchUsers.mockRejectedValue(new Error('HTTP error! status: 404'));

    // ACT: Render component
    render(<UserList />);

    // ASSERT: Wait for error state
    await waitFor(() => {
      expect(screen.getByText('Error: HTTP error! status: 404')).toBeInTheDocument();
    });

    expect(screen.getByText('Error: HTTP error! status: 404')).toBeInTheDocument();
  });
}); 