/**
 * EASY EXAMPLE 1: Simple Greeting Component
 * 
 * COMPONENT DESCRIPTION:
 * A simple greeting component that displays a personalized message based on the user's name.
 * This is the most basic type of React component - it takes props and renders content.
 * 
 * WHAT THIS COMPONENT DOES:
 * - Receives a 'name' prop and displays "Hello, [name]!"
 * - Shows a welcome message
 * - Uses a default name of 'World' if no name is provided
 * - No state management, no user interactions, no side effects
 * 
 * WHAT SHOULD BE TESTED:
 * ✅ Component renders without crashing
 * ✅ Displays the correct greeting message with the provided name
 * ✅ Uses default name when no name prop is provided
 * ✅ Renders proper HTML structure (h1 and p elements)
 * ✅ Shows the welcome message correctly
 * 
 * TESTING CONCEPTS DEMONSTRATED:
 * - Basic component rendering with render()
 * - Finding elements by text content with screen.getByText()
 * - Testing props by passing different values
 * - Testing default prop values
 * - Simple assertions with expect().toBeInTheDocument()
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

export default Greeting; 