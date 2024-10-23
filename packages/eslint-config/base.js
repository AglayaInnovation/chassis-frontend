const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
    extends: ["eslint:recommended", "turbo"],
    plugins: ["only-warn"],
    settings: {
        "import/resolver": {
            typescript: {
                project,
            },
        },
    },
    ignorePatterns: [
        // Ignore dotfiles
        ".*.js",
        "node_modules/",
        "dist/",
    ],
    rules: {
        "keyword-spacing": 2,
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
        "no-unused-vars": "warn",
        indent: ["error", 2],
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "double"],
        semi: ["error", "always"],
        "no-cond-assign": ["error", "always"],
        "import/order": [
            "error",
            {
                groups: [
                    "builtin",
                    "external",
                    "internal",
                    "parent",
                    "sibling",
                    "index",
                ],
                "newlines-between": "always",
            },
        ],
        "no-multiple-empty-lines": [
            "error",
            {
                max: 1,
                maxEOF: 0,
            },
        ],
        curly: "error",
    },
    overrides: [{ files: ["*.js?(x)", "*.ts?(x)"] }],
};
