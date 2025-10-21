import { resolve } from "node:path";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import eslintPluginImport from "eslint-plugin-import";
import onlyWarn from "eslint-plugin-only-warn";
import turbo from "eslint-plugin-turbo";

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    ignores: [".*.js", "node_modules/", "dist/"],
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project,
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslint,
      "import": eslintPluginImport,
      "only-warn": onlyWarn,
      "turbo": turbo,
    },
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        typescript: {
          project,
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      "keyword-spacing": 2,
      "import/no-unresolved": "off",
      "space-before-blocks": "error",
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "always"],
      "block-spacing": ["error", "always"],
      "object-property-newline": [
        "error",
        {
          allowAllPropertiesOnSameLine: false,
        },
      ],
      "no-console": "error",
      "no-unused-vars": "off",
      "indent": ["error", 2],
      "linebreak-style": ["error", "unix"],
      "quotes": ["error", "double"],
      "semi": ["error", "always"],
      "no-cond-assign": ["error", "always"],
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", ["sibling", "parent"], "index", "unknown"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "no-multiple-empty-lines": [
        "error",
        {
          max: 1,
          maxEOF: 0,
        },
      ],
      "curly": "error",

      // TypeScript Rules - Strict Type Safety
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unsafe-argument": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
      }],
      "@typescript-eslint/explicit-function-return-type": ["error", {
        "allowExpressions": true,
        "allowTypedFunctionExpressions": true,
      }],
      "@typescript-eslint/strict-boolean-expressions": "off",
    },
  },
];
