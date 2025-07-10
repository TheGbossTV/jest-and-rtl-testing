/**
 * TestCodeViewer Component
 * 
 * This component displays test code in a modal overlay when the "See Testing Code" button is clicked.
 * It provides a clean way to view the actual test implementation for each component.
 */

import { useState } from 'react';

interface TestCodeViewerProps {
  testCode: string;
  componentCode: string;
  componentName: string;
}

const TestCodeViewer: React.FC<TestCodeViewerProps> = ({ testCode, componentCode, componentName }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // Base highlighting function for both test and component code
  const highlightCodeBase = (code: string, keywords: string[], methods: string[]) => {
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
    keywords.forEach(keyword => {
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
    methods.forEach(method => {
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

  // Highlight test code with test-specific keywords
  const highlightTestCode = (code: string) => {
    const testKeywords = [
      'describe', 'test', 'it', 'expect', 'render', 'screen', 'fireEvent', 'userEvent',
      'beforeEach', 'afterEach', 'jest', 'mock', 'import', 'from', 'const', 'let', 'var'
    ];

    const testMethods = [
      'getByText', 'getByRole', 'toBeInTheDocument', 'toHaveTextContent', 
      'toHaveValue', 'toBeDisabled', 'toBeEnabled', 'click', 'type', 'waitFor'
    ];

    return highlightCodeBase(code, testKeywords, testMethods);
  };

  // Enhanced JSX/React component highlighting
  const highlightComponentCode = (code: string) => {
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

    // Step 3: Highlight JSX tag names (div, button, input, etc.)
    result = result.replace(
      /&lt;\/?(div|button|input|span|p|h1|h2|h3|h4|h5|h6|ul|li|label|form|select|option|pre|code)(?=\s|&gt;)/g,
      '&lt;<span class="jsx-tag">$1</span>'
    );

    // Step 4: Highlight JSX attributes (className, onClick, value, etc.)
    const jsxAttributes = [
      'className', 'onClick', 'onChange', 'onSubmit', 'value', 'placeholder', 
      'type', 'disabled', 'checked', 'id', 'key', 'ref', 'style', 'aria-label'
    ];

    jsxAttributes.forEach(attr => {
      const regex = new RegExp(`\\b${attr}(?=\\s*=)`, 'g');
      result = result.replace(regex, `<span class="jsx-attribute">${attr}</span>`);
    });

    // Step 5: Highlight React/JavaScript keywords
    const componentKeywords = [
      'import', 'export', 'default', 'from', 'const', 'let', 'var', 'function', 
      'interface', 'type', 'React', 'FC', 'return', 'if', 'else', 'true', 'false', 
      'null', 'undefined', 'async', 'await'
    ];

    componentKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b(?![^<]*</span>)(?!.*__COMMENT_)`, 'g');
      result = result.replace(regex, (match, offset, string) => {
        const beforeMatch = string.substring(0, offset);
        const lastSpanStart = beforeMatch.lastIndexOf('<span class="string">');
        const lastSpanEnd = beforeMatch.lastIndexOf('</span>');
        
        if (lastSpanStart > lastSpanEnd) {
          return match;
        }
        
        return `<span class="keyword">${keyword}</span>`;
      });
    });

    // Step 6: Highlight React hooks and methods
    const componentMethods = [
      'useState', 'useEffect', 'useCallback', 'useMemo', 'useRef', 'useContext',
      'map', 'filter', 'reduce', 'forEach', 'includes', 'push', 'pop', 'splice',
      'addEventListener', 'removeEventListener', 'preventDefault', 'stopPropagation'
    ];

    componentMethods.forEach(method => {
      const regex = new RegExp(`\\b${method}\\b(?![^<]*</span>)(?!.*__COMMENT_)`, 'g');
      result = result.replace(regex, (match, offset, string) => {
        const beforeMatch = string.substring(0, offset);
        const lastSpanStart = beforeMatch.lastIndexOf('<span class="string">');
        const lastSpanEnd = beforeMatch.lastIndexOf('</span>');
        
        if (lastSpanStart > lastSpanEnd) {
          return match;
        }
        
        return `<span class="method">${method}</span>`;
      });
    });

    // Step 7: Restore comments from placeholders
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
📁 See Code & Tests
      </button>
      
      {isVisible && (
        <div className="test-code-modal">
          <div className="test-code-content">
            <div className="test-code-header">
              <h3>Code for {componentName} Component</h3>
              <button 
                className="close-button"
                onClick={toggleVisibility}
                aria-label="Close code viewer"
              >
                ✕
              </button>
            </div>
            
            <div className="test-code-body">
              <div className="code-panels">
                <div className="code-panel">
                  <div className="panel-header">
                    <h4>Test Code</h4>
                  </div>
                  <div className="test-code-container">
                    <div className="test-code-line-numbers">
                      {testCode.split('\n').map((_, index) => (
                        <div key={index} className="line-number">
                          {index + 1}
                        </div>
                      ))}
                    </div>
                    <pre className="test-code-text">
                      <code dangerouslySetInnerHTML={{ __html: highlightTestCode(testCode) }} />
                    </pre>
                  </div>
                </div>

                <div className="code-panel">
                  <div className="panel-header">
                    <h4>Component Code</h4>
                  </div>
                  <div className="test-code-container">
                    <div className="test-code-line-numbers">
                      {componentCode.split('\n').map((_, index) => (
                        <div key={index} className="line-number">
                          {index + 1}
                        </div>
                      ))}
                    </div>
                    <pre className="test-code-text">
                      <code dangerouslySetInnerHTML={{ __html: highlightComponentCode(componentCode) }} />
                    </pre>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="test-code-footer">
              <p>💡 Compare the component implementation with its tests!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestCodeViewer; 