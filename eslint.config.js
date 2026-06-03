module.exports = [
  {
    files: ["backend/src/**/*.js"],
    ignores: ["backend/src/__tests__/**"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        require: "readonly",
        module: "readonly",
        exports: "readonly",
        process: "readonly",
        __dirname: "readonly",
        console: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "warn",
      "consistent-return": "error",
    },
  },
  {
    files: ["backend/src/__tests__/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        require: "readonly",
        module: "readonly",
        exports: "readonly",
        process: "readonly",
        __dirname: "readonly",
        console: "readonly",
        jest: "readonly",
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "warn",
    },
  },
  {
    files: ["frontend/src/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        require: "readonly",
        module: "readonly",
        exports: "readonly",
        process: "readonly",
        window: "readonly",
        localStorage: "readonly",
        console: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "warn",
      "consistent-return": "error",
    },
  },
];