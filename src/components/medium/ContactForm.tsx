/**
 * MEDIUM EXAMPLE 2: Contact Form with Validation and State Management
 * 
 * COMPONENT DESCRIPTION:
 * A comprehensive contact form that manages multiple input fields, validation, and submission states.
 * This component demonstrates complex form handling, validation logic, and user experience patterns.
 * 
 * WHAT THIS COMPONENT DOES:
 * - Manages form state for name, email, and message fields
 * - Validates all fields with custom validation rules
 * - Shows real-time error messages as user types
 * - Handles form submission with loading states
 * - Displays success message after submission
 * - Resets form after successful submission
 * - Clears errors when user starts typing
 * - Simulates API call with timeout
 * 
 * WHAT SHOULD BE TESTED:
 * ✅ Form renders with empty fields initially
 * ✅ Input values update when user types
 * ✅ Shows validation errors for empty fields
 * ✅ Shows validation errors for invalid data (email format, length)
 * ✅ Clears errors when user starts typing
 * ✅ Prevents submission when validation fails
 * ✅ Successfully submits form with valid data
 * ✅ Shows loading state during submission
 * ✅ Shows success message after submission
 * ✅ Resets form after successful submission
 * ✅ Calls onSubmit callback with form data
 * ✅ Allows sending another message after success
 * 
 * TESTING CONCEPTS DEMONSTRATED:
 * - Testing form inputs with userEvent.type()
 * - Testing form submission and preventDefault
 * - Testing validation logic and error states
 * - Testing loading states and disabled buttons
 * - Testing success states and state transitions
 * - Testing form reset functionality
 * - Testing callback functions (onSubmit)
 * - Testing async operations with waitFor()
 * - Testing complex user workflows
 */

import { useState } from 'react';

interface ContactFormProps {
  onSubmit?: (data: FormData) => void;
}

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    return newErrors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        onSubmit?.(formData);
        
        // Reset form
        setFormData({ name: '', email: '', message: '' });
      }, 1000);
    }
  };

  if (isSubmitted) {
    return (
      <div className="component-with-tests">
        <div className="component-demo">
          <div className="success-message">
            <h3>Thank you for your message!</h3>
            <p>We'll get back to you soon.</p>
            <button 
              onClick={() => setIsSubmitted(false)}
            >
              Send Another Message
            </button>
          </div>
        </div>
        
        <div className="test-coverage">
          <h4>🧪 Tests Covered:</h4>
          <ul>
            <li>✅ Shows success message after submission</li>
            <li>✅ Allows sending another message</li>
            <li>✅ Resets form after success</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="component-with-tests">
      <div className="component-demo">
        <form onSubmit={handleSubmit} className="contact-form">
          <h2>Contact Us</h2>
          
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && (
              <span className="error-message">
                {errors.name}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && (
              <span className="error-message">
                {errors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className={errors.message ? 'error' : ''}
              rows={4}
            />
            {errors.message && (
              <span className="error-message">
                {errors.message}
              </span>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
      
      <div className="test-coverage">
        <h4>🧪 Tests Covered:</h4>
        <ul>
          <li>✅ Form renders with empty fields</li>
          <li>✅ Input values update when typing</li>
          <li>✅ Shows validation errors for empty/invalid fields</li>
          <li>✅ Clears errors when user starts typing</li>
          <li>✅ Submits form with valid data</li>
          <li>✅ Shows loading state during submission</li>
        </ul>
      </div>
    </div>
  );
};

export default ContactForm; 