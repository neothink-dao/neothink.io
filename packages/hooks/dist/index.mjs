// src/index.ts
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
var useLocalStorage = (key, initialValue) => {
  const readValue = () => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };
  const [storedValue, setStoredValue] = useState(readValue);
  const setValue = useCallback(
    (value) => {
      if (typeof window === "undefined") {
        console.warn(`Tried setting localStorage key "${key}" even though environment is not a client`);
        return;
      }
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        setStoredValue(valueToStore);
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key]);
  return [storedValue, setValue];
};
var useDebounce = (value, delay) => {
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
export {
  useCallback,
  useDebounce,
  useEffect,
  useLocalStorage,
  useMemo,
  useRef,
  useState
};
