import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/useDebounce.ts",
    "src/useLocalStorage.ts",
    "src/useClickOutside.ts",
    "src/useMedia.ts",
    "src/usePrevious.ts",
    "src/useNavigationHistory.ts",
    "src/useOnlineStatus.ts",
  ],
  format: [ "cjs", "esm" ],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [ "react", "next" ],
});
