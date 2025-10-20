import { useEffect, useState, useSyncExternalStore } from "react";

export interface UseOnlineStatusOptions {
  /**
   * Enable polling to check internet connectivity
   * @default false
   */
  enablePolling?: boolean;
  /**
   * Polling interval in milliseconds
   * @default 30000 (30 seconds)
   */
  pollingInterval?: number;
  /**
   * URL to check for connectivity
   * @default undefined
   */
  checkUrl?: string;
}

export interface UseOnlineStatusResult {
  isOnline: boolean;
  isOffline: boolean;
}

/**
 * Hook that checks if the browser has an active internet connection.
 * Uses the Navigator.onLine API and optionally polls a URL to verify connectivity.
 *
 * @param options - Configuration options
 * @returns Object containing isOnline and isOffline status
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isOnline, isOffline } = useOnlineStatus();
 *
 *   return (
 *     <div>
 *       {isOffline && (
 *         <div className="alert">
 *           You are currently offline. Some features may not be available.
 *         </div>
 *       )}
 *       <p>Status: {isOnline ? 'Online' : 'Offline'}</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With polling to verify real connectivity
 * function MyComponent() {
 *   const { isOnline } = useOnlineStatus({
 *     enablePolling: true,
 *     pollingInterval: 10000,
 *     checkUrl: '/api/health'
 *   });
 *
 *   return <div>Connected: {isOnline ? '✓' : '✗'}</div>;
 * }
 * ```
 */
export function useOnlineStatus(
  options: UseOnlineStatusOptions = {}
): UseOnlineStatusResult {
  const { enablePolling = false, pollingInterval = 30000, checkUrl } = options;

  // Subscribe to browser online/offline events
  const isOnline = useSyncExternalStore(
    (callback) => {
      window.addEventListener("online", callback);
      window.addEventListener("offline", callback);

      return () => {
        window.removeEventListener("online", callback);
        window.removeEventListener("offline", callback);
      };
    },
    () => navigator.onLine,
    () => true // Server-side rendering fallback
  );

  const [ isReallyOnline, setIsReallyOnline ] = useState(isOnline);

  useEffect(() => {
    if (!enablePolling || !checkUrl) {
      setIsReallyOnline(isOnline);
      return;
    }

    let intervalId: NodeJS.Timeout;

    const checkConnectivity = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        await fetch(checkUrl, {
          method: "HEAD",
          cache: "no-cache",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        setIsReallyOnline(true);
      } catch (error) {
        setIsReallyOnline(false);
      }
    };

    // Check immediately if browser says we're online
    if (isOnline) {
      checkConnectivity();
    } else {
      setIsReallyOnline(false);
    }

    // Set up polling
    intervalId = setInterval(checkConnectivity, pollingInterval);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [ isOnline, enablePolling, pollingInterval, checkUrl ]);

  const finalStatus = enablePolling && checkUrl ? isReallyOnline : isOnline;

  return {
    isOnline: finalStatus,
    isOffline: !finalStatus,
  };
}
