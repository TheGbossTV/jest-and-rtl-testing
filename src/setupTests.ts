/**
 * Setup file for Jest and React Testing Library
 * This file is run before each test file
 */

// Import jest-dom for additional matchers
import '@testing-library/jest-dom';

// Optional: Configure testing library
import { configure } from '@testing-library/react';

// Configure testing library (optional settings)
configure({
  // Change the default timeout for async operations
  asyncUtilTimeout: 2000,
  
  // Change the default timeout for waitFor operations
  // waitForTimeout: 1000,
}); 