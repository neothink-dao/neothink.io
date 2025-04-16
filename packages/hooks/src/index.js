import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
// Re-export common React hooks
export { useState, useEffect, useCallback, useMemo, useRef };
// Add custom hooks here
export const useLocalStorage = (key, initialValue) => {
    // Get from local storage then
    // parse stored json or return initialValue
    const readValue = () => {
        // Prevent build error on server
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        }
        catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    };
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState(readValue);
    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = useCallback((value) => {
        // Prevent build error on server
        if (typeof window === 'undefined') {
            console.warn(`Tried setting localStorage key "${key}" even though environment is not a client`);
            return;
        }
        try {
            // Allow value to be a function so we have the same API as useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            // Save to local storage
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
            // Save state
            setStoredValue(valueToStore);
        }
        catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);
    // Listen for changes to the value in other tabs/windows
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === key && e.newValue) {
                setStoredValue(JSON.parse(e.newValue));
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key]);
    return [storedValue, setValue];
};
// Example of another custom hook
export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);
    return debouncedValue;
};
// More hooks can be added as needed 
//# sourceMappingURL=index.js.map