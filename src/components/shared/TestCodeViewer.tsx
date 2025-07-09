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

  // Simple and safe syntax highlighting
  const highlightCode = (code: string) => {
    // Escape HTML entities first
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    let result = escaped;

    // Only highlight obvious patterns that won't conflict
    // Highlight single-line comments
    result = result.replace(
      /\/\/.*$/gm,
      '<span class="comment">$&</span>'
    );

    // Highlight multi-line comments
    result = result.replace(
      /\/\*[\s\S]*?\*\//g,
      '<span class="comment">$&</span>'
    );

    // Highlight strings (simple patterns only)
    result = result.replace(
      /&#39;([^&#39;]|\\&#39;)*&#39;/g,
      '<span class="string">$&</span>'
    );

    result = result.replace(
      /&quot;([^&quot;]|\\&quot;)*&quot;/g,
      '<span class="string">$&</span>'
    );

    // Highlight specific testing keywords only
    const testKeywords = [
      'describe', 'test', 'it', 'expect', 'render', 'screen', 'fireEvent', 'userEvent',
      'beforeEach', 'afterEach', 'jest', 'mock', 'import', 'from', 'const', 'let'
    ];

    testKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      result = result.replace(regex, `<span class="keyword">${keyword}</span>`);
    });

    // Highlight common testing methods
    const testMethods = [
      'getByText', 'getByRole', 'toBeInTheDocument', 'toHaveTextContent', 
      'toHaveValue', 'toBeDisabled', 'toBeEnabled', 'click', 'type'
    ];

    testMethods.forEach(method => {
      const regex = new RegExp(`\\b${method}\\b`, 'g');
      result = result.replace(regex, `<span class="method">${method}</span>`);
    });

    return result;
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
                <code dangerouslySetInnerHTML={{ __html: highlightCode(testCode) }} />
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