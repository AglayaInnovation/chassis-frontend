const baseConfig = require("./base");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...baseConfig,
  extends: [
    ...baseConfig.extends,
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: [...baseConfig.plugins, "@typescript-eslint"],
  env: {
    node: true,
    es2020: true,
  },
  rules: {
    ...baseConfig.rules,
    // Add any library-specific rules here
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
