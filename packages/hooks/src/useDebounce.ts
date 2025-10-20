import { useEffect, useState } from "react";

/**
 * Hook that delays updating a value until after a specified delay has elapsed
 * since the last time the value changed. Useful for optimizing expensive operations
 * like API calls triggered by user input.
 *
 * @template T - The type of value being debounced
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds (default: 500ms)
 * @returns The debounced value
 *
 * @example
 * ```tsx
 * function SearchComponent() {
 *   const [search, setSearch] = useState('');
 *   const debouncedSearch = useDebounce(search, 500);
 *
 *   useEffect(() => {
 *     if (debouncedSearch) {
 *       fetchResults(debouncedSearch);
 *     }
 *   }, [debouncedSearch]);
 *
 *   return <input value={search} onChange={(e) => setSearch(e.target.value)} />;
 * }
 * ```
 */

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [ debouncedValue, setDebouncedValue ] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return (): void => {
      clearTimeout(timer);
    };
  }, [ value, delay ]);

  return debouncedValue;
}
