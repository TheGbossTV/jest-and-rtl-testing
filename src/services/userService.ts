/**
 * User Service for API operations
 * 
 * This service handles all user-related API calls.
 * In tests, we can easily mock this service to simulate different scenarios.
 */

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

export const userService = {
  async fetchUsers(url: string): Promise<User[]> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
}; 