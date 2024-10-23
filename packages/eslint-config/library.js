const baseConfig = require("./base");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...baseConfig,
  env: {
    node: true,
  },
  rules: {
    ...baseConfig.rules,
    // Add any library-specific rules here
  },
};
