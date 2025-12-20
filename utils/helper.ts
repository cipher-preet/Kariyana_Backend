// --- helper function is used to parse the data from form data ------------
export const parseIfString = <T>(value: any): T | undefined => {
      if (value === undefined || value === null) return undefined;

      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch {
          return value as T; 
        }
      }

      return value as T;
    };
