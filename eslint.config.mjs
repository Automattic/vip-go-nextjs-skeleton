import jest from "eslint-plugin-jest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import globals from "globals";
import nextConfig from "eslint-config-next";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    {
        ignores: ["eslint.config.mjs", "node_modules/**", ".next/**", "out/**", "jest.setup.js"],
    },
    js.configs.recommended,
    // Use Next.js config directly (it's already in flat config format)
    ...nextConfig,
    ...compat.extends(
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:jest/recommended",
    ),
    {
        plugins: {
            jest,
        },

        languageOptions: {
            globals: {
                ...globals.jest,
            },
        },

        rules: {
            // EditorConfig indent rule (manually configured since plugin has ESLint 9 compatibility issues)
            "indent": ["error", "tab", { SwitchCase: 1 }],

            "@typescript-eslint/ban-ts-comment": ["error", {
                "ts-expect-error": "allow-with-description",
            }],

            "@typescript-eslint/no-unused-vars": ["error", {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_",
                caughtErrorsIgnorePattern: "^_",
            }],
        },
    },
    // Allow require() in CommonJS config files
    {
        files: ["jest.config.js", "next.config.js", "vip.config.js"],
        rules: {
            "@typescript-eslint/no-require-imports": "off",
        },
    },
];
