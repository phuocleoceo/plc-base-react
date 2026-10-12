import prettierRecommended from 'eslint-plugin-prettier/recommended'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import importPlugin from 'eslint-plugin-import'
import react from 'eslint-plugin-react'
import tseslint from 'typescript-eslint'
import globals from 'globals'
import js from '@eslint/js'
import { defineConfig } from 'eslint/config'

export default defineConfig(
  { ignores: ['dist/', 'node_modules/'] },
  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: [js.configs.recommended, importPlugin.flatConfigs.recommended, prettierRecommended],
    languageOptions: {
      globals: globals.node
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json'
        }
      }
    },
    rules: {
      'prettier/prettier': 'warn'
    }
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      react.configs.flat.recommended,
      reactHooks.configs.flat['recommended-latest'],
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
      jsxA11y.flatConfigs.recommended,
      // Must stay last so it can switch off every rule Prettier already handles.
      prettierRecommended
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    },
    settings: {
      react: {
        version: 'detect'
      },
      'import/resolver': {
        typescript: {
          project: './tsconfig.json'
        }
      }
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-no-target-blank': 'warn',
      // These three became errors when the plugins were upgraded. They flag
      // pre-existing code, so they stay warnings here to keep the dependency
      // bump free of unrelated source changes.
      '@typescript-eslint/no-unused-vars': 'warn',
      'jsx-a11y/label-has-associated-control': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      // Options live in .prettierrc so both the CLI and ESLint share them.
      'prettier/prettier': 'warn'
    }
  }
)
