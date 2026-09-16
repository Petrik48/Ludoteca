import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
    {
        // Глобально игнорируем папки со сборкой
        ignores: ['**/dist', '**/node_modules', '**/coverage']
    },
    // Базовые правила для всего проекта
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    // Отключаем правила ESLint, которые конфликтуют с Prettier
    eslintConfigPrettier
);