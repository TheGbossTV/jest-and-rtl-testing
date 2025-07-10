/**
 * EASY EXAMPLE 3: Item List Component with Array Rendering
 * 
 * COMPONENT DESCRIPTION:
 * A list component that renders an array of items with proper empty state handling.
 * This component demonstrates how to work with arrays in React and handle different data states.
 * 
 * WHAT THIS COMPONENT DOES:
 * - Renders a list of items from an array prop
 * - Displays a customizable title for the list
 * - Shows an empty message when no items are provided
 * - Counts and displays the total number of items
 * - Uses proper list semantics (ul/li elements)
 * - Handles both populated and empty array states
 * 
 * WHAT SHOULD BE TESTED:
 * ✅ Renders correct number of list items
 * ✅ Displays each item's text content correctly
 * ✅ Shows empty message when items array is empty
 * ✅ Displays correct item count
 * ✅ Uses custom title when provided
 * ✅ Uses default title when not provided
 * ✅ Uses custom empty message when provided
 * ✅ Renders proper HTML structure (ul, li elements)
 * 
 * TESTING CONCEPTS DEMONSTRATED:
 * - Testing list rendering with querySelector and DOM traversal
 * - Testing empty states vs populated states
 * - Testing array length and content validation
 * - Testing conditional rendering (empty vs list)
 * - Testing custom vs default prop values
 * - Using closest() to isolate component demo areas from educational content
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
            <p className="empty-message">
              {emptyMessage}
            </p>
          ) : (
            <ul>
              {items.map((item, index) => (
                <li key={index}>
                  {item}
                </li>
              ))}
            </ul>
          )}
          
          <div className="item-count">
            Total items: {items.length}
          </div>
        </div>
      </div>
      
      <div className="test-coverage">
        <h4>🧪 Tests Covered:</h4>
        <ul>
          <li>✅ Renders all list items correctly</li>
          <li>✅ Shows empty message when no items</li>
          <li>✅ Displays correct item count</li>
          <li>✅ Uses custom vs default titles</li>
          <li>✅ Uses custom vs default empty messages</li>
          <li>✅ Renders proper list semantics (ul/li)</li>
        </ul>
      </div>
    </div>
  );
};

export default ItemList; 