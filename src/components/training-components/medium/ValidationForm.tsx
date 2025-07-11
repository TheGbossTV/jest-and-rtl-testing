import React, { useState } from 'react';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface ValidationFormProps {
  onSubmit?: (data: FormData) => void;
  onValidationChange?: (isValid: boolean) => void;
}

const ValidationForm: React.FC<ValidationFormProps> = ({ onSubmit, onValidationChange }) => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters long';
    return undefined;
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return undefined;
  };

  const validateForm = (data: FormData): ValidationErrors => {
    return {
      email: validateEmail(data.email),
      password: validatePassword(data.password),
      confirmPassword: validateConfirmPassword(data.password, data.confirmPassword)
    };
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    const newErrors = validateForm(newFormData);
    setErrors(newErrors);
    
    const isValid = Object.values(newErrors).every(error => !error);
    onValidationChange?.(isValid);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    
    const isValid = Object.values(validationErrors).every(error => !error);
    
    if (isValid) {
      onSubmit?.(formData);
    }
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} data-testid="validation-form">
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          data-testid="email-input"
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-message" data-testid="email-error">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          data-testid="password-input"
          className={errors.password ? 'error' : ''}
        />
        {errors.password && <span className="error-message" data-testid="password-error">{errors.password}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          data-testid="confirm-password-input"
          className={errors.confirmPassword ? 'error' : ''}
        />
        {errors.confirmPassword && <span className="error-message" data-testid="confirm-password-error">{errors.confirmPassword}</span>}
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        data-testid="submit-button"
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default ValidationForm; 