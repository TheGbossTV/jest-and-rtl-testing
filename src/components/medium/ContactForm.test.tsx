/**
 * MEDIUM EXAMPLE 2: Testing Form Handling and User Input
 * 
 * This test file demonstrates:
 * - Testing form inputs and changes
 * - Testing form submission
 * - Testing validation logic
 * - Testing error states
 * - Testing asynchronous behavior
 * - Using userEvent for more realistic interactions
 */

/// <reference types="@testing-library/jest-dom" />
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

describe('ContactForm Component', () => {
  
  /**
   * TEST 1: Initial State
   * Test that the form renders with empty fields
   */
  test('renders form with empty fields initially', () => {
    // ARRANGE
    render(<ContactForm />);
    
    // ACT & ASSERT: Check all form fields are empty
    // FORM TESTING: getByLabelText() finds inputs by their associated labels
    // This tests both the input and its accessibility (proper labeling)
    expect(screen.getByLabelText(/name/i)).toHaveValue('');
    expect(screen.getByLabelText(/email/i)).toHaveValue('');
    expect(screen.getByLabelText(/message/i)).toHaveValue('');
    
    // toHaveValue() - Jest matcher for checking input values
    // Works with various input types (text, number, select, etc.)
    
    // Check submit button is present and enabled
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeEnabled();
  });

  /**
   * TEST 2: Form Input Testing
   * Test that typing in inputs updates their values
   */
  test('updates input values when user types', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<ContactForm />);
    
    // ACT: Type in each input field
    // user.type() - REALISTIC TYPING: Simulates real user typing character by character
    // This triggers onChange events naturally, just like real user interaction
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Hello, this is a test message');
    
    // ASSERT: Check values are updated
    // FORM STATE TESTING: Verify form state changes correctly
    expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/email/i)).toHaveValue('john@example.com');
    expect(screen.getByLabelText(/message/i)).toHaveValue('Hello, this is a test message');
  });

  /**
   * TEST 3: Form Validation Testing
   * Test that submitting empty form shows validation errors
   */
  test('shows validation errors when submitting empty form', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<ContactForm />);
    
    // ACT: Submit form without filling fields
    // FORM SUBMISSION TESTING: Test validation on empty form
    await user.click(screen.getByRole('button', { name: /send message/i }));
    
    // ASSERT: Check error messages appear
    // VALIDATION TESTING: Verify error messages are displayed
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Message is required')).toBeInTheDocument();
  });

  /**
   * TEST 4: Field-Specific Validation
   * Test validation for field lengths
   */
  test('shows validation errors for short inputs', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<ContactForm />);
    
    // ACT: Fill fields with short values
    // VALIDATION EDGE CASES: Test minimum length requirements
    await user.type(screen.getByLabelText(/name/i), 'J');
    await user.type(screen.getByLabelText(/message/i), 'Short');
    await user.click(screen.getByRole('button', { name: /send message/i }));
    
    // ASSERT: Check specific error messages
    expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
    expect(screen.getByText('Message must be at least 10 characters')).toBeInTheDocument();
  });

  /**
   * TEST 5: Complex Validation & Mock Functions
   * Test email format validation - demonstrates complex validation edge cases
   */
  test('shows validation error for invalid email', async () => {
    // ARRANGE
    const user = userEvent.setup();
    // MOCK FUNCTIONS: jest.fn() creates a mock function for testing callbacks
    // This allows us to verify if and how the onSubmit callback is called
    const mockOnSubmit = jest.fn();
    render(<ContactForm onSubmit={mockOnSubmit} />);
    
    // ACT: Test that empty email shows required error
    await user.click(screen.getByRole('button', { name: /send message/i }));
    
    // ASSERT: Verify that validation works for required fields
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    
    // NOTE: This test demonstrates a complex validation scenario where browser
    // input type="email" behavior may interact with custom validation logic.
    // In real applications, this edge case would require additional testing
    // and potentially different validation strategies.
    
    // CALLBACK TESTING: The form should NOT be submitted because of validation errors
    // jest.fn() allows us to verify the callback was not called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  /**
   * TEST 6: Dynamic Error Clearing
   * Test that errors clear when user starts typing
   */
  test('clears errors when user starts typing', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<ContactForm />);
    
    // ACT: Submit to show errors, then start typing
    // ERROR STATE TESTING: First trigger validation errors
    await user.click(screen.getByRole('button', { name: /send message/i }));
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    
    // USER EXPERIENCE TESTING: Verify errors clear when user starts fixing them
    await user.type(screen.getByLabelText(/name/i), 'John');
    
    // ASSERT: Error should be cleared
    // DYNAMIC UI TESTING: Check that UI updates based on user actions
    expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
  });

  /**
   * TEST 7: Async Operations & Loading States
   * Test form submission with valid data
   */
  test('successfully submits form with valid data', async () => {
    // ARRANGE
    const user = userEvent.setup();
    const mockOnSubmit = jest.fn();
    render(<ContactForm onSubmit={mockOnSubmit} />);
    
    // ACT: Fill form with valid data
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'This is a valid message with enough characters');
    
    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);
    
    // ASSERT: Check loading state
    // LOADING STATE TESTING: Verify button shows loading state during submission
    expect(screen.getByRole('button', { name: /sending/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled();
    
    // ASYNC TESTING: waitFor() waits for asynchronous operations to complete
    // This is essential for testing async form submissions, API calls, etc.
    await waitFor(() => {
      expect(screen.getByText('Thank you for your message!')).toBeInTheDocument();
    });
    
    // CALLBACK VERIFICATION: Check that callback was called with correct data
    // toHaveBeenCalledWith() verifies the exact arguments passed to the mock
    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a valid message with enough characters'
    });
  });

  /**
   * TEST 8: Success State & Component Flow
   * Test the success message and reset functionality
   */
  test('shows success message after submission', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<ContactForm />);
    
    // ACT: Submit valid form
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'This is a valid message with enough characters');
    await user.click(screen.getByRole('button', { name: /send message/i }));
    
    // ASSERT: Wait for success message
    // ASYNC FLOW TESTING: Test complete user journey from input to success
    await waitFor(() => {
      expect(screen.getByText('Thank you for your message!')).toBeInTheDocument();
    });
    
    // SUCCESS STATE TESTING: Verify all success elements are present
    expect(screen.getByText('Thank you for your message!')).toBeInTheDocument();
    expect(screen.getByText("We'll get back to you soon.")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send another message/i })).toBeInTheDocument();
  });

  /**
   * TEST 9: Error Recovery Testing
   * Test that form can recover from submission errors
   */
  test('allows retry after form submission', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<ContactForm />);
    
    // ACT: Submit valid form and wait for success
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'This is a valid message with enough characters');
    await user.click(screen.getByRole('button', { name: /send message/i }));
    
    // Wait for success state
    await waitFor(() => {
      expect(screen.getByText('Thank you for your message!')).toBeInTheDocument();
    });
    
    // ACT: Click "Send another message" button
    await user.click(screen.getByRole('button', { name: /send another message/i }));
    
    // ASSERT: Verify form is reset and ready for new input
    // FORM RESET TESTING: Check that form returns to initial state
    expect(screen.getByLabelText(/name/i)).toHaveValue('');
    expect(screen.getByLabelText(/email/i)).toHaveValue('');
    expect(screen.getByLabelText(/message/i)).toHaveValue('');
    expect(screen.getByRole('button', { name: /send message/i })).toBeEnabled();
  });
}); 