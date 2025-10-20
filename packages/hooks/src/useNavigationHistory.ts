import { createLogger } from "@aglaya/logger";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

const logger = createLogger({ prefix: "useNavigationHistory" });

export interface NavigationHistoryItem {
  path: string;
  timestamp: number;
}

export interface UseNavigationHistoryOptions {
  maxHistory?: number;
  excludePaths?: string[];
}

export interface UseNavigationHistoryResult {
  history: NavigationHistoryItem[];
  previousPath: string | undefined;
  canGoBack: boolean;
  clearHistory: () => void;
}

/**
 * Hook that tracks navigation history in Next.js applications.
 * Stores the navigation history with timestamps and provides utilities.
 *
 * @param options - Configuration options
 * @returns Object containing history, previousPath, canGoBack, and clearHistory
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { history, previousPath, canGoBack, clearHistory } = useNavigationHistory({
 *     maxHistory: 10,
 *     excludePaths: ['/api', '/admin']
 *   });
 *
 *   return (
 *     <div>
 *       {canGoBack && <button onClick={() => router.back()}>Back to {previousPath}</button>}
 *       <button onClick={clearHistory}>Clear History</button>
 *       <ul>
 *         {history.map((item, i) => (
 *           <li key={i}>{item.path} - {new Date(item.timestamp).toLocaleString()}</li>
 *         ))}
 *       </ul>
 *     </div>
 *   );
 * }
 * ```
 */
export function useNavigationHistory(
  options: UseNavigationHistoryOptions = {}
): UseNavigationHistoryResult {
  const { maxHistory = 20, excludePaths = [] } = options;
  const pathname = usePathname();
  const [ history, setHistory ] = useState<NavigationHistoryItem[]>([]);

  useEffect(() => {
    // Check if path should be excluded
    const shouldExclude = excludePaths.some((excludePath) =>
      pathname.startsWith(excludePath)
    );

    if (shouldExclude) {
      return;
    }

    setHistory((prev) => {
      // Don't add if it's the same as the last path
      if (prev.length > 0 && prev?.[prev.length - 1]?.path === pathname) {
        return prev;
      }

      const newHistory = [
        ...prev,
        {
          path: pathname,
          timestamp: Date.now(),
        },
      ];

      // Limit history size
      if (newHistory.length > maxHistory) {
        return newHistory.slice(-maxHistory);
      }

      return newHistory;
    });
  }, [ pathname, maxHistory, excludePaths ]);

  const previousPath = history?.length > 1 ? history?.[history.length - 2]?.path : undefined;
  const canGoBack = history.length > 1;

  const clearHistory = useCallback(() => {
    setHistory([]);
    logger.info("Navigation history cleared");
  }, []);

  return {
    history,
    previousPath,
    canGoBack,
    clearHistory,
  };
}
