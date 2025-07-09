interface SectionInfoProps {
  level: 'easy' | 'medium' | 'hard';
}

const sectionData = {
  easy: {
    title: 'Easy Examples - Basic Component Testing',
    description: 'These examples demonstrate fundamental React Testing Library concepts for basic component rendering, props testing, and content validation.',
    concepts: [
      'Component rendering with render()',
      'Props testing and validation',
      'Text content verification with getByText()',
      'Conditional rendering testing',
      'CSS classes and styling validation',
      'Basic accessibility testing with roles',
      'Element existence and visibility checks'
    ],
    components: [
      {
        name: 'Greeting',
        purpose: 'Basic component rendering and props testing',
        tests: ['Renders with correct name', 'Handles different prop values', 'Displays proper greeting format']
      },
      {
        name: 'UserCard',
        purpose: 'Conditional rendering and multiple props',
        tests: ['Shows/hides optional fields', 'Applies correct CSS classes', 'Tests active/inactive states', 'Handles missing optional props']
      },
      {
        name: 'ItemList',
        purpose: 'Array rendering and empty states',
        tests: ['Renders list items correctly', 'Shows empty state message', 'Displays correct item count', 'Handles different data types']
      }
    ]
  },
  medium: {
    title: 'Medium Examples - State Management & User Interactions',
    description: 'These examples demonstrate state management testing, event handling, form validation, and user interactions using React Testing Library.',
    concepts: [
      'State management with useState testing',
      'Event handling with user interactions',
      'Form validation and submission testing',
      'Async form operations with loading states',
      'Error handling and validation messages',
      'Button disabled states and boundaries',
      'User interaction simulation with userEvent',
      'Complex component re-rendering'
    ],
    components: [
      {
        name: 'Counter',
        purpose: 'State management and user interactions',
        tests: ['Increments/decrements on button click', 'Respects min/max boundaries', 'Reset functionality', 'Button disabled states', 'Custom step values']
      },
      {
        name: 'ContactForm',
        purpose: 'Form validation and async submission',
        tests: ['Input value updates', 'Validation error messages', 'Form submission flow', 'Loading states', 'Success message display', 'Error clearing on typing']
      }
    ]
  },
  hard: {
    title: 'Hard Examples - Async Operations & Advanced Mocking',
    description: 'These examples demonstrate advanced React Testing Library concepts including API mocking, async operations, complex user interactions, and performance testing.',
    concepts: [
      'API mocking with jest.mock() and MSW',
      'Async operations testing with waitFor()',
      'Loading states and error handling',
      'Request cancellation with AbortController',
      'Debouncing and performance optimization',
      'Complex user interaction flows',
      'Retry mechanisms and error recovery',
      'Advanced mocking strategies',
      'Race condition prevention',
      'Memory leak prevention testing'
    ],
    components: [
      {
        name: 'UserList',
        purpose: 'API data fetching with error handling',
        tests: ['Loading state display', 'Successful data rendering', 'Error state handling', 'Retry functionality', 'Request cancellation', 'Empty state handling']
      },
      {
        name: 'SearchFilter',
        purpose: 'Complex async operations with debouncing',
        tests: ['Debounced search functionality', 'Multiple filter combinations', 'Search statistics tracking', 'Performance optimization', 'Error recovery', 'Clear all functionality']
      }
    ]
  }
};

const SectionInfo: React.FC<SectionInfoProps> = ({ level }) => {
  const data = sectionData[level];

  return (
    <div className="section-info">
      <div className="section-header">
        <h2>{data.title}</h2>
        <p className="section-description">{data.description}</p>
      </div>
      
      <div className="section-content">
        <div className="concepts-section">
          <h3>🎯 Key Testing Concepts Covered:</h3>
          <ul className="concepts-list">
            {data.concepts.map((concept, index) => (
              <li key={index}>{concept}</li>
            ))}
          </ul>
        </div>

        <div className="components-section">
          <h3>📚 Components in This Section:</h3>
          {data.components.map((component, index) => (
            <div key={index} className="component-summary">
              <h4>{component.name}</h4>
              <p className="component-purpose">{component.purpose}</p>
              <div className="component-tests">
                <strong>Tests covered:</strong>
                <ul>
                  {component.tests.map((test, testIndex) => (
                    <li key={testIndex}>{test}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectionInfo; 