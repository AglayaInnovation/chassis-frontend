# useNavigationHistory

A React hook for tracking navigation history in Next.js applications with timestamps and filtering capabilities.

## Installation

```bash
npm install @aglaya/hooks
# or
yarn add @aglaya/hooks
# or
pnpm add @aglaya/hooks
```

## Usage

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

      <h3>Navigation History</h3>
      <ul>
        {history.map((item, i) => (
          <li key={i}>
            {item.path} - {new Date(item.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## API

### Parameters

#### `options?: UseNavigationHistoryOptions`

Optional configuration object:

- **`maxHistory`** (`number`, default: `20`): Maximum number of history items to keep
- **`excludePaths`** (`string[]`, default: `[]`): Array of path prefixes to exclude from history tracking

### Return Value

Returns a `UseNavigationHistoryResult` object:

- **`history`** (`NavigationHistoryItem[]`): Array of navigation history items
- **`previousPath`** (`string | undefined`): The previous path in history, or undefined if none
- **`canGoBack`** (`boolean`): Whether there is a previous path to go back to
- **`clearHistory`** (`() => void`): Function to clear the navigation history

### Types

```typescript
interface NavigationHistoryItem {
  path: string;
  timestamp: number;
}

interface UseNavigationHistoryOptions {
  maxHistory?: number;
  excludePaths?: string[];
}

interface UseNavigationHistoryResult {
  history: NavigationHistoryItem[];
  previousPath: string | undefined;
  canGoBack: boolean;
  clearHistory: () => void;
}
```

## Features

- ✅ Tracks navigation history with timestamps
- ✅ Configurable history size limit
- ✅ Path exclusion filters
- ✅ Prevents duplicate consecutive entries
- ✅ TypeScript support
- ✅ Next.js App Router compatible

## Examples

### Basic Usage

```tsx
function Page() {
  const { history, canGoBack } = useNavigationHistory();

  return (
    <div>
      <p>Visited {history.length} pages</p>
      {canGoBack && <p>Can go back!</p>}
    </div>
  );
}
```

### Custom History Limit

```tsx
function Page() {
  const { history } = useNavigationHistory({ maxHistory: 5 });

  // Only keeps last 5 pages
  return <div>History size: {history.length}</div>;
}
```

### Excluding Paths

```tsx
function Page() {
  const { history } = useNavigationHistory({
    excludePaths: ['/api', '/auth', '/admin']
  });

  // API, auth, and admin routes won't be tracked
  return <div>{/* ... */}</div>;
}
```

### Custom Back Button

```tsx
import { useRouter } from 'next/navigation';

function CustomBackButton() {
  const router = useRouter();
  const { previousPath, canGoBack } = useNavigationHistory();

  if (!canGoBack) return null;

  return (
    <button onClick={() => router.back()}>
      ← Back to {previousPath}
    </button>
  );
}
```

## License

MIT
