/**
 * TestCodeViewer Component
 * 
 * This component displays test code in a modal overlay when the "See Testing Code" button is clicked.
 * It provides a clean way to view the actual test implementation for each component.
 */

import { useState } from 'react';

interface TestCodeViewerProps {
  testCode: string;
  componentName: string;
}

const TestCodeViewer: React.FC<TestCodeViewerProps> = ({ testCode, componentName }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="test-code-viewer">
      <button 
        className="test-code-button"
        onClick={toggleVisibility}
        aria-label={`View test code for ${componentName}`}
      >
        🧪 See Testing Code
      </button>
      
      {isVisible && (
        <div className="test-code-modal">
          <div className="test-code-content">
            <div className="test-code-header">
              <h3>Test Code for {componentName}</h3>
              <button 
                className="close-button"
                onClick={toggleVisibility}
                aria-label="Close test code viewer"
              >
                ✕
              </button>
            </div>
            
            <div className="test-code-body">
              <pre className="test-code-text">
                <code>{testCode}</code>
              </pre>
            </div>
            
            <div className="test-code-footer">
              <p>💡 Copy this code to your test file to implement these tests!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestCodeViewer; 