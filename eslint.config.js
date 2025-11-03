// ESLint v9 flat config for a TypeScript (non-React) project
// Mirrors the rules you had in .eslintrc.json without Airbnb.

const tsParser = require("@typescript-eslint/parser");
const tseslint = require("@typescript-eslint/eslint-plugin");
const importPlugin = require("eslint-plugin-import");
const prettierPlugin = require("eslint-plugin-prettier");
const prettierConfig = require("eslint-config-prettier");

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  {
    ignores: ["*.css", "**/vendor/*.css"],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": tseslint,
      import: importPlugin,
      prettier: prettierPlugin,
    },
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".d.ts"],
        },
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
      // Prettier integration
      "prettier/prettier": ["error", { endOfLine: "auto" }],

      // General preferences
      "import/no-named-as-default": 0,
      "max-len": ["error", { code: 160 }],
      "no-unused-vars": "off",
      "no-console": "off",
      "func-names": "off",
      "no-undef": "off",
      "linebreak-style": "off",
      "operator-linebreak": "off",
      "no-process-exit": "off",
      "object-shorthand": "off",
      "no-new": "off",
      "class-methods-use-this": "off",
      "no-dupe-class-members": "off",
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "*", next: ["return", "if", "for", "while"] },
      ],
      "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": ["error"],
      "@typescript-eslint/explicit-member-accessibility": "warn",
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "classProperty",
          modifiers: ["private"],
          format: ["camelCase"],
          leadingUnderscore: "require",
        },
        {
          selector: "parameter",
          format: ["camelCase"],
          leadingUnderscore: "forbid",
        },
      ],
      "comma-dangle": "off",
      "@typescript-eslint/comma-dangle": [
        "error",
        {
          arrays: "always-multiline",
          objects: "always-multiline",
          imports: "always-multiline",
          enums: "always-multiline",
          exports: "never",
          functions: "never",
        },
      ],
      "arrow-body-style": "off",
      "no-param-reassign": "off",
      "no-bitwise": "off",
      "object-curly-newline": "off",
      "no-restricted-syntax": ["error", "IfStatement > ExpressionStatement > AssignmentExpression"],
      "no-underscore-dangle": "off",
      "import/extensions": "off",
      "import/prefer-default-export": "off",
    },
  },
  // Disable rules that conflict with Prettier formatting
  prettierConfig,
];


