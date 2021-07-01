module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "@btboy/eslint-config"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module"
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "require-jsdoc": "off",
    "operator-linebreak": "off"
  }
};
