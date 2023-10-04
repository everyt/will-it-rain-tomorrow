import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        drop: {
          '0%': { transform: 'translateY(0vh)' },
          '75%': { transform: 'translateY(90vh)' },
          '100%': { transform: 'translateY(90vh)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s forwards',
      },
    },
  },
  plugins: [],
};
export default config;
