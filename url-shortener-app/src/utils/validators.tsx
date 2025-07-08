export const isValidURL = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  
  export const isAlphanumeric = (str: string): boolean => /^[a-z0-9]+$/i.test(str);
  
  export const isValidValidity = (v: any): boolean => {
    const num = parseInt(v);
    return !isNaN(num) && num > 0;
  };
  