import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default tseslint.config(
  // Глобально игнорируем папки со сборкой
  {
    ignores: ['**/dist', '**/node_modules', '**/coverage'],
  },
  // Базовые правила для всего проекта
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  // Доступность (a11y)
  jsxA11y.flatConfigs.recommended,
  {
    rules: {
      'jsx-a11y/control-has-associated-label': 'error',
    },
  },
  // Отключаем правила ESLint, которые конфликтуют с Prettier
  eslintConfigPrettier,
);
