import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Tell Tailwind to scan these files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config
