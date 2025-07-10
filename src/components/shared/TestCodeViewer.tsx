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

  // Simple and safe syntax highlighting with comment precedence
  const highlightCode = (code: string) => {
    // Escape HTML entities first
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    let result = escaped;

    // Step 1: Mark comments with special placeholders to protect them
    const commentPlaceholders: string[] = [];
    let commentIndex = 0;

    // Replace multi-line comments with placeholders
    result = result.replace(/\/\*[\s\S]*?\*\//g, (match) => {
      const placeholder = `__COMMENT_${commentIndex}__`;
      commentPlaceholders[commentIndex] = `<span class="comment">${match}</span>`;
      commentIndex++;
      return placeholder;
    });

    // Replace single-line comments with placeholders
    result = result.replace(/\/\/.*$/gm, (match) => {
      const placeholder = `__COMMENT_${commentIndex}__`;
      commentPlaceholders[commentIndex] = `<span class="comment">${match}</span>`;
      commentIndex++;
      return placeholder;
    });

    // Step 2: Highlight strings (but only outside comments)
    result = result.replace(
      /&#39;([^&#39;]|\\&#39;)*&#39;/g,
      '<span class="string">$&</span>'
    );

    result = result.replace(
      /&quot;([^&quot;]|\\&quot;)*&quot;/g,
      '<span class="string">$&</span>'
    );

    // Step 3: Highlight keywords (but only outside comments and strings)
    const testKeywords = [
      'describe', 'test', 'it', 'expect', 'render', 'screen', 'fireEvent', 'userEvent',
      'beforeEach', 'afterEach', 'jest', 'mock', 'import', 'from', 'const', 'let'
    ];

    testKeywords.forEach(keyword => {
      // Only highlight if not inside a span (string) and not a comment placeholder
      const regex = new RegExp(`\\b${keyword}\\b(?![^<]*</span>)(?!.*__COMMENT_)`, 'g');
      result = result.replace(regex, (match, offset, string) => {
        // Additional check: don't highlight if we're inside a string span
        const beforeMatch = string.substring(0, offset);
        const lastSpanStart = beforeMatch.lastIndexOf('<span class="string">');
        const lastSpanEnd = beforeMatch.lastIndexOf('</span>');
        
        if (lastSpanStart > lastSpanEnd) {
          return match; // We're inside a string span
        }
        
        return `<span class="keyword">${keyword}</span>`;
      });
    });

    // Step 4: Highlight methods (but only outside comments and strings)
    const testMethods = [
      'getByText', 'getByRole', 'toBeInTheDocument', 'toHaveTextContent', 
      'toHaveValue', 'toBeDisabled', 'toBeEnabled', 'click', 'type'
    ];

    testMethods.forEach(method => {
      const regex = new RegExp(`\\b${method}\\b(?![^<]*</span>)(?!.*__COMMENT_)`, 'g');
      result = result.replace(regex, (match, offset, string) => {
        // Additional check: don't highlight if we're inside a string span
        const beforeMatch = string.substring(0, offset);
        const lastSpanStart = beforeMatch.lastIndexOf('<span class="string">');
        const lastSpanEnd = beforeMatch.lastIndexOf('</span>');
        
        if (lastSpanStart > lastSpanEnd) {
          return match; // We're inside a string span
        }
        
        return `<span class="method">${method}</span>`;
      });
    });

    // Step 5: Restore comments from placeholders
    commentPlaceholders.forEach((commentHtml, index) => {
      const placeholder = `__COMMENT_${index}__`;
      result = result.replace(placeholder, commentHtml);
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