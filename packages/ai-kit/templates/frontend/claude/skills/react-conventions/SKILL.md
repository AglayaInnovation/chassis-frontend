---
name: react-conventions
description: Aglaya React/Next.js conventions for components, hooks, data fetching and tests. Use when creating or refactoring React components, custom hooks, or pages.
---

# React conventions (Aglaya)

## File layout

```
src/components/UserCard/
  UserCard.tsx          # component, named export
  UserCard.test.tsx     # Testing Library, behavior-focused
  index.ts              # export { UserCard } from './UserCard'
```

- Named exports only (no `export default`), except where Next.js requires it (`page.tsx`, `layout.tsx`).
- Props type is `<Component>Props`, declared next to the component.

## Components

```tsx
type UserCardProps = {
  user: User;
  onSelect?: (id: string) => void;
};

export function UserCard({ user, onSelect }: UserCardProps) {
  return (
    <button type="button" onClick={() => onSelect?.(user.id)}>
      {user.name}
    </button>
  );
}
```

- Derive values during render instead of syncing them with `useEffect`.
- `useMemo` / `useCallback` only for a measured problem or a referential-equality contract.
- Server Components by default in Next.js App Router; add `'use client'` at the smallest leaf that needs it.

## Data & side effects

- HTTP goes through `@aglaya/api-core`; logging through `@aglaya/logger` (no stray `console.log`).
- Generic behavior (debounce, local storage, media queries) comes from `@aglaya/hooks`.

## Tests

- Query by role/label (`getByRole('button', { name: /save/i })`), not by test id or class.
- Test behavior the user sees, not implementation details or internal state.
