// Email validation utility
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Password validation utilities
export function isValidPassword(password: string, minLength: number = 6): boolean {
  return Boolean(password && password.length >= minLength);
}

export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
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
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Request validation utilities
export function validateRequiredFields(data: Record<string, any>, requiredFields: string[]): {
  isValid: boolean;
  missingFields: string[];
} {
  const missingFields: string[] = [];
  
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      missingFields.push(field);
    }
  }
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}

// Sanitization utilities
export function sanitizeEmail(email: string): string {
  return email ? email.toLowerCase().trim() : '';
}

export function sanitizeString(str: string): string {
  return str ? str.trim() : '';
}

// Performance timing utility
export function createTimer() {
  const startTime = Date.now();
  
  return {
    getElapsed: () => Date.now() - startTime,
    getElapsedFormatted: () => `${Date.now() - startTime}ms`
  };
}