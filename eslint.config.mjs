import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...compat.config({
    extends: ['next',
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
    ],
    rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
      "@typescript-eslint/no-explicit-any": "off", // Desactiva la regla por completo
      // o
      "@typescript-eslint/no-explicit-any": ["warn"], // Cambia el error a una advertencia
    },
  }),
];

export default eslintConfig;
