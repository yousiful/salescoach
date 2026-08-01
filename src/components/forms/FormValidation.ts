// Validation utilities for forms
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationRules {
  [fieldName: string]: ValidationRule;
}

export class FormValidator {
  private rules: ValidationRules;

  constructor(rules: ValidationRules) {
    this.rules = rules;
  }

  validateField(fieldName: string, value: any): string | null {
    const rule = this.rules[fieldName];
    if (!rule) return null;

    // Required validation
    if (rule.required) {
      if (Array.isArray(value) && value.length === 0) {
        return `${this.formatFieldName(fieldName)} is required`;
      }
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return `${this.formatFieldName(fieldName)} is required`;
      }
    }

    // Skip other validations if value is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return null;
    }

    // String-specific validations
    if (typeof value === 'string') {
      // Min length validation
      if (rule.minLength && value.length < rule.minLength) {
        return `${this.formatFieldName(fieldName)} must be at least ${rule.minLength} characters`;
      }

      // Max length validation
      if (rule.maxLength && value.length > rule.maxLength) {
        return `${this.formatFieldName(fieldName)} must be no more than ${rule.maxLength} characters`;
      }

      // Pattern validation
      if (rule.pattern && !rule.pattern.test(value)) {
        return `${this.formatFieldName(fieldName)} format is invalid`;
      }
    }

    // Array-specific validations
    if (Array.isArray(value)) {
      if (rule.minLength && value.length < rule.minLength) {
        return `Please select at least ${rule.minLength} option${rule.minLength > 1 ? 's' : ''}`;
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        return `Please select no more than ${rule.maxLength} option${rule.maxLength > 1 ? 's' : ''}`;
      }
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  }

  validateForm(formData: Record<string, any>): Record<string, string> {
    const errors: Record<string, string> = {};

    Object.keys(this.rules).forEach(fieldName => {
      const error = this.validateField(fieldName, formData[fieldName]);
      if (error) {
        errors[fieldName] = error;
      }
    });

    return errors;
  }

  isFormValid(formData: Record<string, any>): boolean {
    const errors = this.validateForm(formData);
    return Object.keys(errors).length === 0;
  }

  private formatFieldName(fieldName: string): string {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }
}

// Common validation patterns
export const ValidationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  url: /^https?:\/\/.+/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  noSpecialChars: /^[a-zA-Z0-9\s]+$/
};

// Pre-built validation rules for common fields
export const CommonValidationRules = {
  email: {
    required: true,
    pattern: ValidationPatterns.email,
    maxLength: 254
  },
  
  productName: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: ValidationPatterns.noSpecialChars
  },
  
  industry: {
    required: true
  },
  
  targetAudience: {
    required: true,
    minLength: 5,
    maxLength: 150
  },
  
  painPoints: {
    required: true,
    minLength: 1,
    maxLength: 5,
    custom: (value: string[]) => {
      if (value.length > 5) {
        return 'Please select no more than 5 pain points for best results';
      }
      return null;
    }
  },
  
  keyBenefits: {
    required: true,
    minLength: 1,
    maxLength: 5,
    custom: (value: string[]) => {
      if (value.length > 5) {
        return 'Please select no more than 5 benefits for best results';
      }
      return null;
    }
  },
  
  callToAction: {
    maxLength: 100,
    custom: (value: string) => {
      if (value && !value.toLowerCase().includes('schedule') && 
          !value.toLowerCase().includes('book') && 
          !value.toLowerCase().includes('start') &&
          !value.toLowerCase().includes('get') &&
          !value.toLowerCase().includes('request') &&
          !value.toLowerCase().includes('download') &&
          !value.toLowerCase().includes('join') &&
          !value.toLowerCase().includes('see') &&
          !value.toLowerCase().includes('speak') &&
          !value.toLowerCase().includes('contact')) {
        return 'Call to action should include an action verb (schedule, book, start, get, etc.)';
      }
      return null;
    }
  }
};

// Smart validation that provides helpful suggestions
export const SmartValidator = {
  suggestImprovements: (fieldName: string, value: any): string[] => {
    const suggestions: string[] = [];

    switch (fieldName) {
      case 'productName':
        if (typeof value === 'string') {
          if (value.length < 5) {
            suggestions.push('Consider being more descriptive about your product');
          }
          if (!value.includes(' ') && value.length > 15) {
            suggestions.push('Consider breaking long product names into shorter, clearer phrases');
          }
        }
        break;

      case 'targetAudience':
        if (typeof value === 'string') {
          if (!value.toLowerCase().includes('manager') && 
              !value.toLowerCase().includes('owner') && 
              !value.toLowerCase().includes('director') &&
              !value.toLowerCase().includes('executive')) {
            suggestions.push('Consider specifying the decision-maker level (manager, director, owner, etc.)');
          }
          if (value.toLowerCase().includes('everyone') || value.toLowerCase().includes('anyone')) {
            suggestions.push('Try to be more specific about your ideal customer');
          }
        }
        break;

      case 'painPoints':
        if (Array.isArray(value) && value.length > 3) {
          suggestions.push('Focusing on 2-3 main pain points often creates more impactful scripts');
        }
        break;

      case 'keyBenefits':
        if (Array.isArray(value) && value.length > 3) {
          suggestions.push('Highlighting 2-3 key benefits helps maintain focus and clarity');
        }
        break;
    }

    return suggestions;
  }
};