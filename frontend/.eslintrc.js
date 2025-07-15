/**
 * Next.js 14 이상 + ESLint 호환 ESLint 설정
 * - JSON → JS 변환 (주석 가능)
 */

module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },

  extends: [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:security/recommended",
    "plugin:prettier/recommended",
  ],

  plugins: ["perfectionist", "security"],

  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: "module",
    project: "./tsconfig.json",
  },

  rules: {
    "prettier/prettier": [
      "error",
      {
        singleQuote: false,
      },
    ],

    "no-unused-vars": "off",

    /**
     * 최신 perfectionist는 옵션 없이 error만 설정 가능
     * 커스텀 그룹 옵션 제거!
     */
    // "perfectionist/sort-imports": "error",

    "import/no-unresolved": "error",
    "import/no-cycle": "error",

    // "@typescript-eslint/consistent-type-imports": [
    //   "error",
    //   {
    //     fixStyle: "separate-type-imports",
    //   },
    // ],
    "perfectionist/sort-imports": "off",
    "@typescript-eslint/consistent-type-imports": "off",
    "@typescript-eslint/no-implied-eval": "error",
  },
};
