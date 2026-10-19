## Frontend standards

- React function components + hooks only. Prefer composition and colocated state; lift state only when shared.
- Reuse `@aglaya/ui`, `@aglaya/hooks`, `@aglaya/api-core` and `@aglaya/logger` before writing new primitives.
- Accessibility is part of "done": semantic HTML, labelled controls, keyboard navigation, visible focus.
- To verify UI changes, run the app and check it with the Playwright MCP server instead of assuming it renders.
- See the `react-conventions` skill for file layout and patterns.
