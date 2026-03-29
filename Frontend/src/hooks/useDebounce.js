import { useEffect, useState } from "react";

/**
 * Returns a debounced version of a rapidly changing value.
 * @template T
 * @param {T} value
 * @param {number} [delay=500]
 * @returns {T}
 */
export default function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
