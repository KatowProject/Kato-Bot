import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs" },
    rules: {
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z].*" }],
    },
  },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
];
