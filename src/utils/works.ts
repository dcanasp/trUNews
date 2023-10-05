export const works = (element: any): boolean => {
    // Check for null and undefined
    if (element === null || element === undefined) {
      return false;
    }
  
    // Check for empty string
    if (typeof element === 'string' && element.trim() === '') {
      return false;
    }
  
    // Check for empty array
    if (Array.isArray(element) && element.length === 0) {
      return false;
    }
  
    // Check for empty object
    if (typeof element === 'object' && Object.keys(element).length === 0) {
      return false;
    }
  
    return true;
  };
  