// Utility functions for form validation and localStorage operations

// Email validation function
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation function (basic)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-()]{7,}$/;
  return phoneRegex.test(phone);
};

// Safe localStorage operations
export const getFromLocalStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return null;
  }
};

export const setToLocalStorage = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
  }
};

export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
  }
};

// Retry utility function
export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${attempt + 1} failed:`, error);
      
      if (attempt < maxRetries - 1) {
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, baseDelay * Math.pow(2, attempt)));
      }
    }
  }
  
  throw lastError!;
};
