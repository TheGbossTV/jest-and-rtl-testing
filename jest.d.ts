// Type definitions for jest-dom matchers
import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveTextContent(text: string): R;
      toBeInTheDocument(): R;
      toHaveValue(value: string): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toHaveClass(...classes: string[]): R;
    }
  }
} 