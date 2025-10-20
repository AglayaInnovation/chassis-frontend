"use client";

import {
  useDebounce,
  useLocalStorage,
  useClickOutside,
  useMedia,
  usePrevious,
  useNavigationHistory,
  useOnlineStatus,
} from "@aglaya/hooks";
import { ArrowLeft, Wifi, WifiOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

import { ThemeToggle } from "@/components/theme-toggle";

export default function HooksDemoPage(): JSX.Element {
  const router = useRouter();

  // useDebounce demo
  const [ searchTerm, setSearchTerm ] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  // useLocalStorage demo
  const [ name, setName ] = useLocalStorage("demo-name", "");

  // useClickOutside demo
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [ isDropdownOpen, setIsDropdownOpen ] = useState(false);
  useClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  // useMedia demo
  const isMobile = useMedia("(max-width: 768px)");
  const isTablet = useMedia("(min-width: 769px) and (max-width: 1024px)");
  const isDesktop = useMedia("(min-width: 1025px)");

  // usePrevious demo
  const [ count, setCount ] = useState(0);
  const previousCount = usePrevious(count);

  // useNavigationHistory demo
  const { history, previousPath, canGoBack, clearHistory } =
    useNavigationHistory({
      maxHistory: 5,
    });

  // useOnlineStatus demo
  const { isOnline } = useOnlineStatus();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">@aglaya/hooks Demo</h1>
          <p className="text-muted-foreground">
            Interactive examples of all available React hooks
          </p>
        </div>

        {/* Online Status Banner */}
        <div
          className={`mb-6 rounded-lg border p-4 ${
            isOnline
              ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900"
              : "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900"
          }`}
        >
          <div className="flex items-center gap-3">
            {isOnline ? (
              <Wifi className="h-5 w-5 text-green-600 dark:text-green-400" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-600 dark:text-red-400" />
            )}
            <div>
              <h3 className="font-semibold text-sm">useOnlineStatus</h3>
              <p
                className={`text-sm ${
                  isOnline
                    ? "text-green-700 dark:text-green-300"
                    : "text-red-700 dark:text-red-300"
                }`}
              >
                {isOnline ? "You are online" : "You are offline"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Navigation History */}
          <section className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">useNavigationHistory</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Can go back:</span>
                <span
                  className={
                    canGoBack ? "text-green-600" : "text-muted-foreground"
                  }
                >
                  {canGoBack ? "Yes" : "No"}
                </span>
              </div>
              {previousPath && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Previous path:</span>
                  <code className="px-2 py-1 bg-muted rounded text-xs">
                    {previousPath}
                  </code>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={clearHistory}
                  className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 text-sm font-medium transition-colors"
                >
                  Clear History
                </button>
                <button
                  onClick={() => router.push("/api-demo")}
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-colors"
                >
                  Go to API Demo
                </button>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">
                  History ({history.length}/5):
                </h3>
                <ul className="space-y-1">
                  {history.map((item, i) => (
                    <li
                      key={i}
                      className="text-sm flex items-center gap-2 text-muted-foreground"
                    >
                      <span className="w-4 text-right">{i + 1}.</span>
                      <code className="px-2 py-1 bg-muted rounded text-xs flex-1">
                        {item.path}
                      </code>
                      <span className="text-xs">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* useDebounce */}
          <section className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">useDebounce</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Type to search (debounced by 500ms)
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Type something..."
                  className="w-full px-3 py-2 bg-background border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Immediate value:</span>
                  <div className="mt-1 p-2 bg-muted rounded">
                    {searchTerm || <span className="text-muted-foreground">(empty)</span>}
                  </div>
                </div>
                <div>
                  <span className="font-medium">Debounced value:</span>
                  <div className="mt-1 p-2 bg-muted rounded">
                    {debouncedSearch || <span className="text-muted-foreground">(empty)</span>}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* useLocalStorage */}
          <section className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">useLocalStorage</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Enter your name (persisted in localStorage)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name..."
                  className="w-full px-3 py-2 bg-background border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="text-sm">
                <span className="font-medium">Stored value:</span>
                <div className="mt-1 p-2 bg-muted rounded">
                  {name || <span className="text-muted-foreground">(empty)</span>}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Key: <code className="bg-muted px-1 py-0.5 rounded">demo-name</code>
                </p>
              </div>
            </div>
          </section>

          {/* useClickOutside */}
          <section className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">useClickOutside</h2>
            <div className="space-y-4">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-colors"
              >
                {isDropdownOpen ? "Close" : "Open"} Dropdown
              </button>
              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="p-4 border rounded-lg bg-popover text-popover-foreground shadow-lg"
                >
                  <p className="text-sm font-medium mb-3">
                    Click outside this box to close it
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="px-3 py-2 rounded hover:bg-accent cursor-pointer">
                      Option 1
                    </li>
                    <li className="px-3 py-2 rounded hover:bg-accent cursor-pointer">
                      Option 2
                    </li>
                    <li className="px-3 py-2 rounded hover:bg-accent cursor-pointer">
                      Option 3
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* useMedia */}
          <section className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">useMedia</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Resize your browser window to see changes
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                className={`p-4 rounded-lg border text-center transition-colors ${
                  isMobile
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <div className="text-2xl mb-2">📱</div>
                <div className="font-medium text-sm">Mobile</div>
                <div className="text-xs mt-1">
                  {isMobile ? "Active" : "Inactive"}
                </div>
              </div>
              <div
                className={`p-4 rounded-lg border text-center transition-colors ${
                  isTablet
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <div className="text-2xl mb-2">📱</div>
                <div className="font-medium text-sm">Tablet</div>
                <div className="text-xs mt-1">
                  {isTablet ? "Active" : "Inactive"}
                </div>
              </div>
              <div
                className={`p-4 rounded-lg border text-center transition-colors ${
                  isDesktop
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <div className="text-2xl mb-2">🖥️</div>
                <div className="font-medium text-sm">Desktop</div>
                <div className="text-xs mt-1">
                  {isDesktop ? "Active" : "Inactive"}
                </div>
              </div>
            </div>
          </section>

          {/* usePrevious */}
          <section className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">usePrevious</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCount((c) => c - 1)}
                  className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 text-sm font-medium transition-colors"
                >
                  -
                </button>
                <span className="text-3xl font-bold min-w-[60px] text-center">
                  {count}
                </span>
                <button
                  onClick={() => setCount((c) => c + 1)}
                  className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 text-sm font-medium transition-colors"
                >
                  +
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Current count:</span>
                  <div className="mt-1 p-2 bg-muted rounded text-center text-lg font-semibold">
                    {count}
                  </div>
                </div>
                <div>
                  <span className="font-medium">Previous count:</span>
                  <div className="mt-1 p-2 bg-muted rounded text-center text-lg font-semibold">
                    {previousCount !== undefined ? previousCount : "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
