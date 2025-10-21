import baseConfig from "./base.mjs";
import nextPlugin from "@next/eslint-plugin-next";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  ...baseConfig,
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    plugins: {
      "@next/next": nextPlugin,
    },
    languageOptions: {
      globals: {
        React: "readonly",
        JSX: "readonly",
      },
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: ["tsconfig.json", "apps/*/tsconfig.json"],
          alwaysTryTypes: true,
        },
      },
    },
  },
];
