import React, { useEffect, useState } from "react";

interface UseLocalStorageOptions<T> {
  /** Turn the stored string back into a value. */
  deserialize: (raw: string) => T;
  /** Turn the value into a string for storage. Defaults to JSON.stringify. */
  serialize?: (value: T) => string;
}

const resolveInitial = <T>(initialValue: T | (() => T)): T =>
  typeof initialValue === "function"
    ? (initialValue as () => T)()
    : initialValue;

/**
 * Stable serializer for values stored as raw strings (no JSON wrapping).
 * Use it when the stored value is a plain string, e.g. `serialize: serializeRaw`.
 */
export const serializeRaw = (value: string): string => value;

/**
 * useState that stays in sync with localStorage.
 * Reads once on mount (with a safe fallback when storage is unavailable or
 * the stored value is corrupted) and persists every change.
 */
const useLocalStorage = <T>(
  key: string,
  initialValue: T | (() => T),
  options: UseLocalStorageOptions<T>,
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const { deserialize, serialize = JSON.stringify } = options;

  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? resolveInitial(initialValue) : deserialize(raw);
    } catch {
      // Storage unavailable or the stored value is corrupted.
      return resolveInitial(initialValue);
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, serialize(value));
    } catch {
      // Storage unavailable — ignore.
    }
  }, [key, serialize, value]);

  return [value, setValue];
};

export default useLocalStorage;
