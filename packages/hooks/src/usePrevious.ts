import { useEffect, useRef } from "react";

/**
 * Hook that stores the previous value of a variable.
 * Useful for comparing current and previous values in effects.
 *
 * @template T - The type of value being tracked
 * @param value - The current value
 * @returns The previous value
 *
 * @example
 * ```tsx
 * function Counter() {
 *   const [count, setCount] = useState(0);
 *   const prevCount = usePrevious(count);
 *
 *   useEffect(() => {
 *     if (prevCount !== undefined) {
 *       console.log(`Count changed from ${prevCount} to ${count}`);
 *     }
 *   }, [count, prevCount]);
 *
 *   return (
 *     <div>
 *       <p>Current: {count}</p>
 *       <p>Previous: {prevCount}</p>
 *       <button onClick={() => setCount(count + 1)}>Increment</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [ value ]);

  return ref.current;
}
