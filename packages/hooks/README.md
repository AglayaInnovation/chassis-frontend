# @aglaya/hooks

A collection of reusable React hooks for common functionality in modern web applications.

## Installation

```bash
npm install @aglaya/hooks
# or
yarn add @aglaya/hooks
# or
pnpm add @aglaya/hooks
```

## Available Hooks

- [useNavigationHistory](#usenavigationhistory) - Track navigation history in Next.js apps
- [useOnlineStatus](#useonlinestatus) - Monitor internet connectivity
- [useLocalStorage](#uselocalstorage) - Sync state with localStorage
- [useDebounce](#usedebounce) - Debounce rapidly changing values
- [useClickOutside](#useclickoutside) - Detect clicks outside an element
- [useMedia](#usemedia) - Responsive media queries
- [usePrevious](#useprevious) - Access previous value of state/props

---

## useNavigationHistory

Track navigation history in Next.js applications with timestamps and filtering capabilities.

### Usage

```tsx
import { useNavigationHistory } from '@aglaya/hooks';
import { useRouter } from 'next/navigation';

function MyComponent() {
  const router = useRouter();
  const { history, previousPath, canGoBack, clearHistory } = useNavigationHistory({
    maxHistory: 10,
    excludePaths: ['/api', '/admin']
  });

  return (
    <div>
      {canGoBack && (
        <button onClick={() => router.back()}>
          Back to {previousPath}
        </button>
      )}
      <button onClick={clearHistory}>Clear History</button>
    </div>
  );
}
```

### API

**Parameters:**
- `options?.maxHistory` (number, default: 20) - Maximum number of history items
- `options?.excludePaths` (string[]) - Paths to exclude from tracking

**Returns:**
- `history` (NavigationHistoryItem[]) - Array of navigation items
- `previousPath` (string | undefined) - Previous path in history
- `canGoBack` (boolean) - Whether navigation back is possible
- `clearHistory` (() => void) - Clear the history

---

## useOnlineStatus

Monitor internet connectivity with optional polling to verify real connectivity.

### Usage

```tsx
import { useOnlineStatus } from '@aglaya/hooks';

function MyComponent() {
  const { isOnline, isOffline } = useOnlineStatus({
    enablePolling: true,
    pollingInterval: 10000,
    checkUrl: '/api/health'
  });

  return (
    <div>
      {isOffline && (
        <div className="alert">
          You are currently offline. Some features may not be available.
        </div>
      )}
      <p>Status: {isOnline ? 'Online' : 'Offline'}</p>
    </div>
  );
}
```

### API

**Parameters:**
- `options?.enablePolling` (boolean, default: false) - Enable connectivity polling
- `options?.pollingInterval` (number, default: 30000) - Polling interval in ms
- `options?.checkUrl` (string) - URL to check for connectivity

**Returns:**
- `isOnline` (boolean) - Whether the user is online
- `isOffline` (boolean) - Whether the user is offline

---

## useLocalStorage

Sync state with localStorage with automatic persistence and cross-tab synchronization.

### Usage

```tsx
import { useLocalStorage } from '@aglaya/hooks';

function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
}
```

### API

**Parameters:**
- `key` (string) - localStorage key
- `initialValue` (T) - Initial value if not in localStorage

**Returns:**
- `[value, setValue]` - Tuple similar to useState

**Features:**
- ✅ Automatic persistence to localStorage
- ✅ Cross-tab/window synchronization
- ✅ SSR-safe (returns initialValue on server)
- ✅ Error handling with fallback to initialValue
- ✅ TypeScript support with generics

---

## useDebounce

Debounce rapidly changing values to optimize performance.

### Usage

```tsx
import { useDebounce } from '@aglaya/hooks';
import { useState, useEffect } from 'react';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearch) {
      // Perform search with debounced value
      fetchSearchResults(debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### API

**Parameters:**
- `value` (T) - Value to debounce
- `delay` (number) - Delay in milliseconds

**Returns:**
- Debounced value

---

## useClickOutside

Detect clicks outside of a specific element.

### Usage

```tsx
import { useClickOutside } from '@aglaya/hooks';
import { useRef, useState } from 'react';

function Dropdown() {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}>
        Toggle Dropdown
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <a href="#">Item 1</a>
          <a href="#">Item 2</a>
        </div>
      )}
    </div>
  );
}
```

### API

**Parameters:**
- `ref` (RefObject<HTMLElement>) - Ref to the element
- `handler` (() => void) - Callback when clicking outside

---

## useMedia

Responsive media query hook for conditional rendering based on screen size.

### Usage

```tsx
import { useMedia } from '@aglaya/hooks';

function ResponsiveComponent() {
  const isMobile = useMedia('(max-width: 768px)');
  const isTablet = useMedia('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMedia('(min-width: 1025px)');

  return (
    <div>
      {isMobile && <MobileView />}
      {isTablet && <TabletView />}
      {isDesktop && <DesktopView />}
    </div>
  );
}
```

### API

**Parameters:**
- `query` (string) - Media query string

**Returns:**
- `matches` (boolean) - Whether the media query matches

**Features:**
- ✅ SSR-safe (returns false on server)
- ✅ Automatically updates on window resize
- ✅ Cleans up event listeners

---

## usePrevious

Access the previous value of a state or prop.

### Usage

```tsx
import { usePrevious } from '@aglaya/hooks';
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const previousCount = usePrevious(count);

  return (
    <div>
      <p>Current count: {count}</p>
      <p>Previous count: {previousCount ?? 'None'}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### API

**Parameters:**
- `value` (T) - Current value to track

**Returns:**
- Previous value (T | undefined)

---

## TypeScript Support

All hooks are written in TypeScript and include full type definitions.

```tsx
import { useLocalStorage, useDebounce } from '@aglaya/hooks';

// Type inference works automatically
const [user, setUser] = useLocalStorage('user', { name: 'John', age: 30 });
// user is typed as { name: string; age: number }

// You can also specify types explicitly
const [value, setValue] = useLocalStorage<string>('key', 'default');
const debouncedValue = useDebounce<string>(searchTerm, 500);
```

## Requirements

- React 18+
- Next.js 14+ (for useNavigationHistory)

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
