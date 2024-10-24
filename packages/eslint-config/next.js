const baseConfig = require("./base");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...baseConfig,
  parser: "@typescript-eslint/parser",
  extends: [
      ...baseConfig.extends,
    "plugin:@next/next/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: [...baseConfig.plugins, "@typescript-eslint", "@next/next"],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
    browser: true,
  },
  rules: {
    ...baseConfig.rules,
    // Add any Next.js-specific rules here,
  },
  settings: {
    ...baseConfig.settings,
    "import/resolver": {
      ...baseConfig.settings["import/resolver"],
      typescript: {
        ...baseConfig.settings["import/resolver"].typescript,
        project: ["tsconfig.json", "apps/*/tsconfig.json"],
      },
    },
  },
};
