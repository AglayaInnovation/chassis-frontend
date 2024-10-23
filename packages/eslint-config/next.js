const baseConfig = require("./base");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...baseConfig,
  extends: [...baseConfig.extends, "plugin:@next/next/recommended"],
  plugins: [...baseConfig.plugins, "@next/next"],
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
    // Add any Next.js-specific rules here
  },
};
