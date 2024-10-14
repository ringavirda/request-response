import globals from "globals";
import process from "process";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
  {
    ignores: ["dist"],
  },
  { files: ["src/**/*.{js,ts,d.ts}"] },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    rules: {
      "linebreak-style": [
        "error",
        require("os").EOL === "\r\n" ? "windows" : "unix",
      ],
    },
  },
];
