const baseConfig = require("./base");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...baseConfig,
  extends: [...baseConfig.extends, "plugin:react/recommended"],
  plugins: [...baseConfig.plugins, "react"],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    browser: true,
  },
  rules: {
    ...baseConfig.rules,
    // Add any React-specific rules here
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
  },
};
