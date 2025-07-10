import { useState } from 'react';
import './App.css';

// Easy Examples
import Greeting from './components/easy/Greeting';
import UserCard from './components/easy/UserCard';
import ItemList from './components/easy/ItemList';

// Medium Examples
import Counter from './components/medium/Counter';
import ContactForm from './components/medium/ContactForm';

// Hard Examples
import UserList from './components/hard/UserList';
import { SearchFilter } from './components/hard/SearchFilter';

// Shared Components
import SectionInfo from './components/shared/SectionInfo';
import TestCodeViewer from './components/shared/TestCodeViewer';

// Test Code Data
import { codeData } from './data/testCodeData';

/**
 * MAIN APP COMPONENT
 * 
 * This component demonstrates all testing examples organized by difficulty level.
 * It showcases comprehensive testing patterns from basic rendering to complex
 * async operations, providing an educational resource for learning React Testing Library.
 * 
 * Features:
 * - Navigation between different example categories
 * - Interactive examples with live demonstrations
 * - Educational comments explaining testing concepts
 * - Progressive complexity from easy to hard examples
 */

type ExampleCategory = 'easy' | 'medium' | 'hard';

interface ExampleInfo {
  title: string;
  description: string;
  concepts: string[];
}

const exampleCategories: Record<ExampleCategory, ExampleInfo> = {
  easy: {
    title: 'Easy Examples',
    description: 'Basic component rendering, props, and content validation',
    concepts: [
      'Component rendering',
      'Props testing',
      'Text content validation',
      'Conditional rendering',
      'CSS classes and styling',
      'Basic accessibility testing'
    ]
  },
  medium: {
    title: 'Medium Examples',
    description: 'Event handling, state management, and user interactions',
    concepts: [
      'State management testing',
      'Event handling with fireEvent',
      'Form validation and submission',
      'User interactions with userEvent',
      'Loading states and async forms',
      'Error handling and validation'
    ]
  },
  hard: {
    title: 'Hard Examples',
    description: 'Async operations, mocking, API calls, and complex interactions',
    concepts: [
      'API mocking with jest.mock()',
      'Async operations with waitFor',
      'Complex user interaction flows',
      'Debouncing and performance testing',
      'Error boundaries and retry logic',
      'Advanced mocking strategies'
    ]
  }
};

function App() {
  const [activeCategory, setActiveCategory] = useState<ExampleCategory>('easy');
  const [showInfo, setShowInfo] = useState(true);

  const renderCategoryContent = () => {
    switch (activeCategory) {
      case 'easy':
        return (
          <div className="examples-container">
            <SectionInfo level="easy" />
            
            <div className="example-section">
              <h3>1. Greeting Component</h3>
              <p className="example-description">
                Demonstrates basic component rendering, props testing, and text content validation.
              </p>
              <div className="example-demo-with-test">
                <div className="example-demo-content">
                  <Greeting name="Alice" />
                  <Greeting name="Bob" />
                  <Greeting name="Charlie" />
                </div>
                <div className="example-test-button">
                  <TestCodeViewer 
                    testCode={codeData.Greeting.testCode} 
                    componentCode={codeData.Greeting.componentCode}
                    componentName="Greeting"
                  />
                </div>
              </div>
            </div>

            <div className="example-section">
              <h3>2. User Card Component</h3>
              <p className="example-description">
                Shows conditional rendering, CSS classes, multiple props, and accessibility testing.
              </p>
              <div className="example-demo-with-test">
                <div className="example-demo-content">
                  <UserCard
                    name="John Doe"
                    email="john@example.com"
                    isActive={true}
                    age={30}
                  />
                  <UserCard
                    name="Jane Smith"
                    email="jane@example.com"
                    isActive={false}
                    age={25}
                  />
                </div>
                <div className="example-test-button">
                  <TestCodeViewer 
                    testCode={codeData.UserCard.testCode} 
                    componentCode={codeData.UserCard.componentCode}
                    componentName="UserCard"
                  />
                </div>
              </div>
            </div>

            <div className="example-section">
              <h3>3. Item List Component</h3>
              <p className="example-description">
                Demonstrates array rendering, empty states, and various data types.
              </p>
              <div className="example-demo-with-test">
                <div className="example-demo-content">
                  <ItemList
                    title="Shopping List"
                    items={['Apples', 'Bananas', 'Oranges']}
                  />
                  <ItemList
                    title="Numbers"
                    items={['1', '2', '3', '4', '5']}
                  />
                  <ItemList
                    title="Empty List"
                    items={[]}
                  />
                </div>
                <div className="example-test-button">
                  <TestCodeViewer 
                    testCode={codeData.ItemList.testCode} 
                    componentCode={codeData.ItemList.componentCode}
                    componentName="ItemList"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'medium':
        return (
          <div className="examples-container">
            <SectionInfo level="medium" />
            
            <div className="example-section">
              <h3>1. Counter Component</h3>
              <p className="example-description">
                Demonstrates state management, user interactions, and accessibility testing.
              </p>
              <div className="example-demo-with-test">
                <div className="example-demo-content">
                  <Counter initialCount={0} />
                  <Counter initialCount={10} step={5} />
                  <Counter initialCount={0} min={0} max={10} />
                </div>
                <div className="example-test-button">
                  <TestCodeViewer 
                    testCode={codeData.Counter.testCode} 
                    componentCode={codeData.Counter.componentCode}
                    componentName="Counter"
                  />
                </div>
              </div>
            </div>

            <div className="example-section">
              <h3>2. Contact Form Component</h3>
              <p className="example-description">
                Shows form validation, async submission, and complex user interactions.
              </p>
              <div className="example-demo-with-test">
                <div className="example-demo-content">
                  <ContactForm onSubmit={(data: {name: string, email: string, message: string}) => console.log('Form submitted:', data)} />
                </div>
                <div className="example-test-button">
                  <TestCodeViewer 
                    testCode={codeData.ContactForm.testCode} 
                    componentCode={codeData.ContactForm.componentCode}
                    componentName="ContactForm"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'hard':
        return (
          <div className="examples-container">
            <SectionInfo level="hard" />
            
            <div className="example-section">
              <h3>1. User List Component</h3>
              <p className="example-description">
                Demonstrates API mocking, async operations, loading states, and error handling.
              </p>
              <div className="example-demo-with-test">
                <div className="example-demo-content">
                  <UserList />
                </div>
                <div className="example-test-button">
                  <TestCodeViewer 
                    testCode={codeData.UserList.testCode} 
                    componentCode={codeData.UserList.componentCode}
                    componentName="UserList"
                  />
                </div>
              </div>
            </div>

            <div className="example-section">
              <h3>2. Search Filter Component</h3>
              <p className="example-description">
                Shows debouncing, complex async operations, advanced mocking, and intricate user interactions.
              </p>
              <div className="example-demo-with-test">
                <div className="example-demo-content">
                  <SearchFilter 
                    onResultsChange={(results) => console.log('Search results:', results)}
                    placeholder="Search products..."
                    debounceMs={300}
                    maxResults={5}
                  />
                </div>
                <div className="example-test-button">
                  <TestCodeViewer 
                    testCode={codeData.SearchFilter.testCode} 
                    componentCode={codeData.SearchFilter.componentCode}
                    componentName="SearchFilter"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>React Testing Library Examples</h1>
        <p className="app-subtitle">
          A comprehensive guide to testing React components with Jest and React Testing Library
        </p>
      </header>

      <nav className="category-navigation" role="navigation" aria-label="Example categories">
        {Object.entries(exampleCategories).map(([key, info]) => (
          <button
            key={key}
            className={`nav-button ${activeCategory === key ? 'active' : ''}`}
            onClick={() => setActiveCategory(key as ExampleCategory)}
            aria-current={activeCategory === key ? 'page' : undefined}
            data-testid={`nav-${key}`}
          >
            {info.title}
          </button>
        ))}
      </nav>

      <main className="main-content">
        <div className="category-header">
          <div className="category-title">
            <h2>{exampleCategories[activeCategory].title}</h2>
            <button
              className="info-toggle"
              onClick={() => setShowInfo(!showInfo)}
              aria-expanded={showInfo}
              data-testid="info-toggle"
            >
              {showInfo ? 'Hide Info' : 'Show Info'}
            </button>
          </div>
          
          {showInfo && (
            <div className="category-info" data-testid="category-info">
              <p className="category-description">
                {exampleCategories[activeCategory].description}
              </p>
              
              <div className="concepts-section">
                <h4>Testing Concepts Covered:</h4>
                <ul className="concepts-list">
                  {exampleCategories[activeCategory].concepts.map((concept, index) => (
                    <li key={index}>{concept}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {renderCategoryContent()}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <h3>How to Use This Guide</h3>
          <div className="usage-instructions">
            <div className="instruction-item">
              <strong>1. Explore Examples:</strong> Navigate between Easy, Medium, and Hard examples to see different testing patterns in action.
            </div>
            <div className="instruction-item">
              <strong>2. View Test Files:</strong> Each component has a corresponding `.test.tsx` file with comprehensive test coverage.
            </div>
            <div className="instruction-item">
              <strong>3. Run Tests:</strong> Use `npm test` to run all tests and see the testing concepts in practice.
            </div>
            <div className="instruction-item">
              <strong>4. Study Comments:</strong> All code includes detailed comments explaining testing strategies and best practices.
            </div>
          </div>
          
          <div className="test-commands">
            <h4>Useful Test Commands:</h4>
            <code>npm test</code> - Run all tests
            <br />
            <code>npm test -- --watch</code> - Run tests in watch mode
            <br />
            <code>npm test -- --coverage</code> - Run tests with coverage report
            <br />
            <code>npm test ComponentName</code> - Run specific component tests
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
