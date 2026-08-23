import Joi from 'joi';

export const validateEmail = (email: string): boolean => {
  const schema = Joi.string().email().required();
  const { error } = schema.validate(email);
  return !error;
};

export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

export const validatePhoneNumber = (phone: string): boolean => {
  const schema = Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required();
  const { error } = schema.validate(phone);
  return !error;
};

export const validateTOTPCode = (code: string): boolean => {
  return /^\d{6}$/.test(code);
};
