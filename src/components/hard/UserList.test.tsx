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
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });

    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
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

    // ASSERT: Check that API was called twice with different URLs
    // CALL COUNT TESTING: Verify number of mock function calls
    expect(mockUserService.fetchUsers).toHaveBeenCalledTimes(2);
    // CALL SEQUENCE TESTING: Verify the order and arguments of calls
    expect(mockUserService.fetchUsers).toHaveBeenNthCalledWith(1, 'https://api1.com');
    expect(mockUserService.fetchUsers).toHaveBeenNthCalledWith(2, 'https://api2.com');
  });

  /**
   * TEST 7: UI Elements & Accessibility
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
    
    // NOTE: In a real app, you'd implement proper retry logic instead of page reload
    // This test verifies the button exists and is accessible
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
}); 