import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // studio/ is a self-contained Sanity package with its own tooling
  globalIgnores(['dist', 'studio']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Sanity query results are untyped JSON; mapping them goes through `any`
      // at the fetch boundary by design (validated by fallbacks, not types).
      '@typescript-eslint/no-explicit-any': 'off',
      // lux.tsx (design system) and seo.tsx intentionally co-export components
      // with their design tokens / helpers; this rule only affects HMR granularity.
      'react-refresh/only-export-components': 'off',
    },
  },
])
