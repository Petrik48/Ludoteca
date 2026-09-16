import baseConfig from '../../../BuildTracker/tailwind.config.base';

const config = {
  // Наследуем всю магию из корня
  presets: [baseConfig],
  // Указываем пути только к исходникам ui-kit
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
};

export default config;
