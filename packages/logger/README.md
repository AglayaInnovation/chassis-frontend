# @aglaya/logger

A lightweight, flexible logging utility for both browser and Node.js environments.

## Features

- ✅ Multiple log levels (DEBUG, INFO, WARN, ERROR, SILENT)
- ✅ Colored console output
- ✅ Optional timestamps
- ✅ Prefix support for component/module identification
- ✅ Child loggers with inherited configuration
- ✅ Custom log handlers
- ✅ TypeScript support
- ✅ Works in both browser and Node.js

## Installation

```bash
npm install @aglaya/logger
# or
yarn add @aglaya/logger
# or
pnpm add @aglaya/logger
```

## Usage

### Basic Usage

```typescript
import { logger } from '@aglaya/logger';

logger.debug('Debug message');
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message');
```

### Create a Custom Logger

```typescript
import { createLogger, LogLevel } from '@aglaya/logger';

const logger = createLogger({
  level: LogLevel.DEBUG,
  prefix: 'MyApp',
  timestamps: true,
  colors: true,
});

logger.info('Application started');
```

### Child Loggers

```typescript
import { createLogger } from '@aglaya/logger';

const appLogger = createLogger({ prefix: 'App' });
const apiLogger = appLogger.child('API');
const dbLogger = appLogger.child('DB');

appLogger.info('Application started'); // [App] [INFO] Application started
apiLogger.info('Request received');    // [App:API] [INFO] Request received
dbLogger.info('Connected to database'); // [App:DB] [INFO] Connected to database
```

### Log Levels

```typescript
import { logger, LogLevel } from '@aglaya/logger';

// Set minimum log level
logger.setLevel(LogLevel.WARN);

logger.debug('This will not show');
logger.info('This will not show');
logger.warn('This will show');
logger.error('This will show');

// Check current level
const currentLevel = logger.getLevel();
```

### With Data

```typescript
logger.info('User logged in', { userId: 123, email: 'user@example.com' });
logger.error('Failed to fetch data', { error: new Error('Network error') });
```

### Custom Handler

```typescript
import { createLogger, LogLevel } from '@aglaya/logger';

const logger = createLogger({
  handler: (level, message, data) => {
    // Send to external logging service
    fetch('/api/logs', {
      method: 'POST',
      body: JSON.stringify({ level: LogLevel[level], message, data }),
    });
  },
});

logger.info('Custom log'); // Sent to your API
```

### With Timestamps

```typescript
import { createLogger } from '@aglaya/logger';

const logger = createLogger({
  timestamps: true,
  prefix: 'App',
});

logger.info('Event occurred');
// Output: [2024-01-15T10:30:45.123Z] [App] [INFO] Event occurred
```

### Disable Colors

```typescript
import { createLogger } from '@aglaya/logger';

const logger = createLogger({
  colors: false, // Useful for file logging or environments without ANSI support
});
```

## API

### `createLogger(options?: LoggerOptions): Logger`

Create a new logger instance.

#### Options

```typescript
interface LoggerOptions {
  level?: LogLevel;        // Minimum log level (default: LogLevel.INFO)
  prefix?: string;         // Prefix for all messages
  colors?: boolean;        // Enable ANSI colors (default: true)
  timestamps?: boolean;    // Show timestamps (default: false)
  handler?: LogHandler;    // Custom log handler
}
```

### `Logger` Methods

- `debug(message: string, data?: unknown): void` - Log debug message
- `info(message: string, data?: unknown): void` - Log info message
- `warn(message: string, data?: unknown): void` - Log warning message
- `error(message: string, data?: unknown): void` - Log error message
- `setLevel(level: LogLevel): void` - Set minimum log level
- `getLevel(): LogLevel` - Get current log level
- `child(prefix: string): Logger` - Create child logger with inherited config

### `LogLevel` Enum

```typescript
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  SILENT = 4,
}
```

## Examples

### React Component Logging

```typescript
import { createLogger } from '@aglaya/logger';

const logger = createLogger({ prefix: 'MyComponent' });

function MyComponent() {
  useEffect(() => {
    logger.info('Component mounted');
    return () => logger.info('Component unmounted');
  }, []);

  const handleClick = () => {
    logger.debug('Button clicked');
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

### API Client Logging

```typescript
import { createLogger, LogLevel } from '@aglaya/logger';

const apiLogger = createLogger({
  prefix: 'API',
  level: LogLevel.DEBUG,
});

async function fetchData(url: string) {
  apiLogger.debug('Fetching data', { url });

  try {
    const response = await fetch(url);
    apiLogger.info('Data fetched successfully', { status: response.status });
    return response.json();
  } catch (error) {
    apiLogger.error('Failed to fetch data', { url, error });
    throw error;
  }
}
```

### Node.js Server Logging

```typescript
import { createLogger } from '@aglaya/logger';

const serverLogger = createLogger({
  prefix: 'Server',
  timestamps: true,
});

const requestLogger = serverLogger.child('Request');
const dbLogger = serverLogger.child('Database');

app.use((req, res, next) => {
  requestLogger.info(`${req.method} ${req.path}`);
  next();
});

dbLogger.info('Connected to database');
```

## License

MIT
