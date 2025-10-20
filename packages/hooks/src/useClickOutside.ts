import { useEffect, RefObject } from "react";

/**
 * Hook that detects clicks outside a referenced element and calls a handler.
 * Useful for closing dropdowns, modals, or tooltips when clicking outside.
 *
 * @param ref - React ref to the element to detect outside clicks for
 * @param handler - Callback function to execute when clicking outside
 *
 * @example
 * ```tsx
 * function Dropdown() {
 *   const [isOpen, setIsOpen] = useState(false);
 *   const dropdownRef = useRef(null);
 *
 *   useClickOutside(dropdownRef, () => setIsOpen(false));
 *
 *   return (
 *     <div ref={dropdownRef}>
 *       <button onClick={() => setIsOpen(!isOpen)}>Menu</button>
 *       {isOpen && <ul>...</ul>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent): void => {
      const el = ref.current;

      // Do nothing if clicking ref's element or descendent elements
      if (!el || el.contains(event.target as Node)) {
        return;
      }

      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return (): void => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ ref, handler ]);
}
