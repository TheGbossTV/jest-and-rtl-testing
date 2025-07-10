/**
 * EASY EXAMPLE 2: User Card Component with Conditional Rendering
 * 
 * COMPONENT DESCRIPTION:
 * A user profile card that displays user information with conditional rendering.
 * This component demonstrates how to handle multiple props and show/hide content based on data availability.
 * 
 * WHAT THIS COMPONENT DOES:
 * - Displays user name (required)
 * - Conditionally shows email if provided
 * - Conditionally shows age if provided
 * - Shows user status (active/inactive) with visual indicators
 * - Applies different CSS classes based on active status
 * - Uses default values for optional props
 * 
 * WHAT SHOULD BE TESTED:
 * ✅ Renders user name correctly
 * ✅ Shows email when provided, hides when not provided
 * ✅ Shows age when provided, hides when not provided
 * ✅ Displays correct status indicator (active/inactive)
 * ✅ Applies correct CSS classes based on status
 * ✅ Uses default isActive value when not specified
 * ✅ Renders proper HTML structure and test IDs
 * 
 * TESTING CONCEPTS DEMONSTRATED:
 * - Testing conditional rendering with different prop combinations
 * - Using regex patterns for flexible text matching across HTML elements
 * - Testing CSS classes and dynamic styling
 * - Testing default prop values and edge cases
 * - Testing with and without optional props
 * - Using getByText() and role queries for text content verification
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
        <div className={`user-card ${isActive ? 'active' : 'inactive'}`}>
          <h2>{name}</h2>
          
          {email && (
            <p>
              <strong>Email:</strong> {email}
            </p>
          )}
          
          {age && (
            <p>
              <strong>Age:</strong> {age} years old
            </p>
          )}
          
          <div className="status">
            <span 
              className={`status-indicator ${isActive ? 'active' : 'inactive'}`}
            >
              {isActive ? '🟢 Active' : '🔴 Inactive'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="test-coverage">
        <h4>🧪 Tests Covered:</h4>
        <ul>
          <li>✅ Shows/hides email when provided/missing</li>
          <li>✅ Shows/hides age when provided/missing</li>
          <li>✅ Displays correct active/inactive status</li>
          <li>✅ Applies correct CSS classes</li>
          <li>✅ Uses default isActive value</li>
          <li>✅ Renders user name correctly</li>
        </ul>
      </div>
    </div>
  );
};

export default UserCard; 