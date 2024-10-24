# @aglaya/eslint-config

This package provides Aglaya's ESLint configurations as an extensible shared config.

## Installation

First, install the package along with its peer dependencies:

```bash
npm install --save-dev @aglaya/eslint-config eslint@^8.0.0 typescript@^5.0.0
yarn add --dev @aglaya/eslint-config eslint@^8.0.0 typescript@^5.0.0
```

## Usage

Aglaya's ESLint config comes with several presets:

- `base`: The base configuration for all JavaScript projects
- `library`: Configuration for library projects
- `next`: Configuration for Next.js projects
- `react-internal`: Configuration for internal React projects

To use these configurations, create an `.eslintrc.js` file in your project root and extend the desired configuration:

### For Next.js projects:

```javascript
module.exports = {
  extends: ['@aglaya/eslint-config/next'],
  // Add any project-specific overrides here
};
```

### For library projects:

```javascript
module.exports = {
  extends: ['@aglaya/eslint-config/library'],
  // Add any project-specific overrides here
};
```

### For internal React projects:

```javascript
module.exports = {
  extends: ['@aglaya/eslint-config/react-internal'],
  // Add any project-specific overrides here
};
```

## Extending the configuration

You can extend or override any rules in your project's `.eslintrc.js` file. For example:

```javascript
module.exports = {
  extends: ['@aglaya/eslint-config/next'],
  rules: {
    // Override or add additional rules here
    'no-console': 'warn',
    'react/prop-types': 'off',
  },
};
```

## TypeScript

This configuration includes TypeScript support out of the box. Make sure you have a `tsconfig.json` file in your project root. If you're using a monorepo structure, ensure that the `tsconfig.json` files for all your apps are correctly referenced in the configuration.

## Troubleshooting

If you encounter any issues, try the following steps:

1. Ensure all peer dependencies are installed correctly.
2. Clear the ESLint cache and re-run ESLint:

   ```bash
   npm run lint -- --cache --cache-location ./node_modules/.cache/eslint-cache --cache-strategy content
   ```

3. Check that your `tsconfig.json` file is properly configured for your project structure.

## Contributing

If you'd like to contribute to this ESLint configuration, please submit a pull request or open an issue in the [GitHub repository](https://github.com/AglayaInnovation/chassis-frontend/tree/main/packages/eslint-config).

## License

This project is licensed under the MIT License.
```

This README provides a comprehensive guide for users to implement and extend your ESLint configuration. It includes installation instructions, usage examples for different project types, information on how to extend the configuration, TypeScript support details, troubleshooting tips, and contribution guidelines.
