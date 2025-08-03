import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    'src/app/**/*.{ts,tsx}',
    'src/components/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
      },
    },
  },
  plugins: [],
}

export default config
