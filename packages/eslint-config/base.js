
const { resolve } = require("node:path");
const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:turbo/recommended"
    ],
    parser: "@typescript-eslint/parser",
    plugins: [
        "@typescript-eslint",
        "only-warn",
        "import"
    ],
    settings: {
        "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".tsx"]
        },
        "import/resolver": {
            typescript: {
                project,
                alwaysTryTypes: true
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
        "no-unused-vars": "off", // Desactivar la regla base en favor de la de TypeScript
        indent: ["error", 2],
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "double"],
        semi: ["error", "always"],
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
        curly: "error",

        // TypeScript Rules - Strict Type Safety
        "@typescript-eslint/no-explicit-any": "error", // ❌ Prohibir 'any'
        "@typescript-eslint/no-unsafe-argument": "error", // ❌ Prohibir argumentos de tipo any
        "@typescript-eslint/no-unsafe-assignment": "error", // ❌ Prohibir asignaciones any
        "@typescript-eslint/no-unsafe-call": "error", // ❌ Prohibir llamadas any
        "@typescript-eslint/no-unsafe-member-access": "error", // ❌ Prohibir acceso a miembros any
        "@typescript-eslint/no-unsafe-return": "error", // ❌ Prohibir retorno de any
        "@typescript-eslint/no-unused-vars": ["warn", {
            "argsIgnorePattern": "^_",
            "varsIgnorePattern": "^_"
        }], // Advertir sobre variables no usadas (permite _ prefix)
        "@typescript-eslint/explicit-function-return-type": ["error", {
            "allowExpressions": true,
            "allowTypedFunctionExpressions": true
        }], // Requerir tipos de retorno explícitos en funciones
        "@typescript-eslint/strict-boolean-expressions": "off", // Opcional: activar para expresiones booleanas estrictas
    },
    overrides: [{ files: ["*.js?(x)", "*.ts?(x)"] }],
};
