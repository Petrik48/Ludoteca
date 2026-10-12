const config = {
  content: [
    // Сканируем само приложение web
    './src/**/*.{js,ts,jsx,tsx}',
    // ⚠️ КРИТИЧЕСКИ ВАЖНО: Сканируем исходники UI-кита!
    '../../packages/ui-kit/src/**/*.{js,ts,jsx,tsx}',
  ],
};

export default config;
