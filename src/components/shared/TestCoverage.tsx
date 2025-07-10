import React from 'react';

interface TestCoverageProps {
  tests: string[];
}

const TestCoverage: React.FC<TestCoverageProps> = ({ tests }) => {
  return (
    <div className="test-coverage">
      <h4>🧪 Tests Covered:</h4>
      <ul>
        {tests.map((test, index) => (
          <li key={index}>✅ {test}</li>
        ))}
      </ul>
    </div>
  );
};

export default TestCoverage; 