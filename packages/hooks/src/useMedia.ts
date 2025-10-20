import { useState, useEffect } from "react";

/**
 * Hook that tracks the state of a CSS media query.
 * Returns true if the media query matches, false otherwise.
 *
 * @param query - The media query string to match
 * @returns Boolean indicating if the media query matches
 *
 * @example
 * ```tsx
 * function ResponsiveComponent() {
 *   const isMobile = useMedia('(max-width: 768px)');
 *   const isTablet = useMedia('(min-width: 769px) and (max-width: 1024px)');
 *   const isDark = useMedia('(prefers-color-scheme: dark)');
 *
 *   return (
 *     <div>
 *       {isMobile && <MobileView />}
 *       {isTablet && <TabletView />}
 *       {isDark && <span>Dark mode is on</span>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useMedia(query: string): boolean {
  const getMatches = (mediaQuery: string): boolean => {
    // Prevent SSR issues
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia(mediaQuery).matches;
  };

  const [ matches, setMatches ] = useState<boolean>(getMatches(query));

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    // Update state when media query changes
    const handleChange = (): void => {
      setMatches(mediaQuery.matches);
    };

    // Initial check
    handleChange();

    // Listen for changes
    mediaQuery.addEventListener("change", handleChange);

    return (): void => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [ query ]);

  return matches;
}
