import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {
    languageOptions: {
      globals: {
        fetch: "readonly",
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        setInterval: "readonly",
        console: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        HTMLInputElement: "readonly",
        google: "readonly",
        gapi: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/prefer-as-const": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "prefer-const": "off",
      "no-undef": "off",
    },
  },
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    rules: {
      "vue/component-api-style": ["error", ["script-setup"]],
      "vue/multi-word-component-names": "off",
      "vue/no-deprecated-router-link-tag-prop": "off",
    },
  },
];
