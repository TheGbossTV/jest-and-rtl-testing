/**
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
    
    // Check that no list is rendered (in the component output area)
    const componentOutput = screen.getByText('No items to display').closest('.component-demo');
    expect(componentOutput).not.toBeNull();
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
   * TEST 3: Single Item
   * Test rendering with one item
   */
  test('renders single item correctly', () => {
    // ARRANGE: Render with one item
    const items = ['First item'];
    render(<ItemList items={items} />);
    
    // ACT & ASSERT: Check list is rendered
    // Use a more specific query that looks for the item list, not the educational content lists
    const itemsContainer = screen.getByText('First item').closest('ul');
    expect(itemsContainer).toBeInTheDocument();
    
    // Check single item is present
    // Query for listitem within the actual component output area
    const componentOutput = screen.getByText('First item').closest('.component-demo');
    expect(componentOutput).not.toBeNull();
    const listItems = componentOutput!.querySelectorAll('li');
    expect(listItems).toHaveLength(1);
    expect(listItems[0]).toHaveTextContent('First item');
    
    // Check item count
    expect(screen.getByText('Total items: 1')).toBeInTheDocument();
    
    // Check no empty message
    expect(screen.queryByText('No items to display')).not.toBeInTheDocument();
  });

  /**
   * TEST 4: Multiple Items
   * Test rendering with multiple items
   */
  test('renders multiple items correctly', () => {
    // ARRANGE: Render with multiple items
    const items = ['Apple', 'Banana', 'Cherry', 'Date'];
    render(<ItemList items={items} />);
    
    // ACT & ASSERT: Check all items are rendered
    const componentOutput = screen.getByText('Apple').closest('.component-demo');
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
   * TEST 5: Custom Title
   * Test custom title prop
   */
  test('renders custom title', () => {
    // ARRANGE: Render with custom title
    const customTitle = 'My Favorite Foods';
    render(<ItemList items={['Pizza']} title={customTitle} />);
    
    // ACT & ASSERT: Check custom title appears
    const componentOutput = screen.getByText(customTitle).closest('.component-demo');
    expect(componentOutput).not.toBeNull();
    const heading = componentOutput!.querySelector('h3');
    expect(heading).toHaveTextContent(customTitle);
  });

  /**
   * TEST 6: Default Title
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
   * TEST 7: List Structure
   * Test the HTML structure of the list
   */
  test('renders proper HTML list structure', () => {
    // ARRANGE: Render with items
    const items = ['Item 1', 'Item 2'];
    render(<ItemList items={items} />);
    
    // ACT & ASSERT: Check list structure
    const componentOutput = screen.getByText('Item 1').closest('.component-demo');
    expect(componentOutput).not.toBeNull();
    const list = componentOutput!.querySelector('ul');
    expect(list).toBeInTheDocument();
    
    // Check list items have correct role
    const listItems = componentOutput!.querySelectorAll('li');
    expect(listItems).toHaveLength(2);
  });

  /**
   * TEST 8: Testing with Various Data Types
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
    
    // Check specific content
    expect(listItems[0]).toHaveTextContent(''); // Empty string
    expect(listItems[1]).toHaveTextContent('Normal text');
    expect(listItems[2]).toHaveTextContent('Text with numbers 123');
    expect(listItems[3]).toHaveTextContent('Special chars !@#$%');
  });
}); 