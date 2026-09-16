/** @type {import('tailwindcss').Config} */
const baseConfig = {
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Подключаем наши семантические группы
        primary: {
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--color-primary-foreground)',
          hover: 'var(--color-primary-hover)',
          active: 'var(--color-primary-active)',
          ring: 'var(--color-primary-ring)',
          disabled: {
            DEFAULT: 'var(--color-primary-disabled)',
            fg: 'var(--color-primary-disabled-fg)',
          },
          subtle: {
            DEFAULT: 'var(--color-primary-subtle)',
            fg: 'var(--color-primary-subtle-fg)',
          },
          border: 'var(--color-primary-border)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          foreground: 'var(--color-secondary-foreground)',
          hover: 'var(--color-secondary-hover)',
          active: 'var(--color-secondary-active)',
          ring: 'var(--color-secondary-ring)',
          disabled: {
            DEFAULT: 'var(--color-secondary-disabled)',
            fg: 'var(--color-secondary-disabled-fg)',
          },
          subtle: {
            DEFAULT: 'var(--color-secondary-subtle)',
            fg: 'var(--color-secondary-subtle-fg)',
          },
          border: 'var(--color-secondary-border)',
        },
        error: {
          DEFAULT: 'var(--color-error)',
          foreground: 'var(--color-error-foreground)',
          hover: 'var(--color-error-hover)',
          active: 'var(--color-error-active)',
          ring: 'var(--color-error-ring)',
          disabled: {
            DEFAULT: 'var(--color-error-disabled)',
            fg: 'var(--color-error-disabled-fg)',
          },
          subtle: {
            DEFAULT: 'var(--color-error-subtle)',
            fg: 'var(--color-error-subtle-fg)',
          },
          border: 'var(--color-error-border)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          foreground: 'var(--color-success-foreground)',
          hover: 'var(--color-success-hover)',
          active: 'var(--color-success-active)',
          ring: 'var(--color-success-ring)',
          disabled: {
            DEFAULT: 'var(--color-success-disabled)',
            fg: 'var(--color-success-disabled-fg)',
          },
          subtle: {
            DEFAULT: 'var(--color-success-subtle)',
            fg: 'var(--color-success-subtle-fg)',
          },
          border: 'var(--color-success-border)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          foreground: 'var(--color-warning-foreground)',
          hover: 'var(--color-warning-hover)',
          active: 'var(--color-warning-active)',
          ring: 'var(--color-warning-ring)',
          disabled: {
            DEFAULT: 'var(--color-warning-disabled)',
            fg: 'var(--color-warning-disabled-fg)',
          },
          subtle: {
            DEFAULT: 'var(--color-warning-subtle)',
            fg: 'var(--color-warning-subtle-fg)',
          },
          border: 'var(--color-warning-border)',
        },
        info: {
          DEFAULT: 'var(--color-info)',
          foreground: 'var(--color-info-foreground)',
          hover: 'var(--color-info-hover)',
          active: 'var(--color-info-active)',
          ring: 'var(--color-info-ring)',
          disabled: {
            DEFAULT: 'var(--color-info-disabled)',
            fg: 'var(--color-info-disabled-fg)',
          },
          subtle: {
            DEFAULT: 'var(--color-info-subtle)',
            fg: 'var(--color-info-subtle-fg)',
          },
          border: 'var(--color-info-border)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          raised: 'var(--color-surface-raised)',
          sunken: 'var(--color-surface-sunken)',
        },
        sidebar: 'var(--color-sidebar)',
        border: {
          DEFAULT: 'var(--color-border)',
          strong: 'var(--color-border-strong)',
        },
        foreground: {
          DEFAULT: 'var(--color-foreground)',
          muted: 'var(--color-foreground-muted)',
          subtle: 'var(--color-foreground-subtle)',
        },
      },
    },
  },
};

export default baseConfig;
