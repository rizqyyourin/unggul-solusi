// Input sanitization utilities for security
export const sanitizeInput = {
  // Remove potentially dangerous characters but keep normal text
  text: (input: string): string => {
    return input
      // Remove SQL injection attempts
      .replace(/['";\\]/g, '')
      // Remove script tags and potential XSS
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      // Remove null bytes and control characters except newlines/tabs
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      // Trim whitespace
      .trim()
  },

  // For names - allow letters, spaces, dots, hyphens, apostrophes
  name: (input: string): string => {
    return input
      .replace(/[^a-zA-Z\s.\-']/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  },

  // For location/domisili - allow letters, numbers, spaces, common punctuation
  location: (input: string): string => {
    return input
      .replace(/[^a-zA-Z0-9\s.,\-]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  },

  // For ID - strict alphanumeric with underscore
  id: (input: string): string => {
    return input
      .replace(/[^A-Z0-9_]/g, '')
      .trim()
  }
}

// Additional validation functions
export const validateInput = {
  // Check for common SQL injection patterns
  hasSQLInjection: (input: string): boolean => {
    const sqlPatterns = [
      /(\bunion\b.*\bselect\b)/i,
      /(\bselect\b.*\bfrom\b)/i,
      /(\binsert\b.*\binto\b)/i,
      /(\bdelete\b.*\bfrom\b)/i,
      /(\bdrop\b.*\btable\b)/i,
      /(\bupdate\b.*\bset\b)/i,
      /--/,
      /\/\*/,
      /\*\//,
      /;/
    ]
    return sqlPatterns.some(pattern => pattern.test(input))
  },

  // Check for XSS attempts
  hasXSS: (input: string): boolean => {
    const xssPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i
    ]
    return xssPatterns.some(pattern => pattern.test(input))
  },

  // Check if input is suspicious
  isSuspicious: (input: string): boolean => {
    return validateInput.hasSQLInjection(input) || validateInput.hasXSS(input)
  }
}