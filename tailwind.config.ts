import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './lib/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        graphite: '#0b1117',
        panel: '#111827',
        silver: '#dfe7ef',
        blue: {
          500: '#4da3ff',
          600: '#2d7ef7',
        },
        accent: '#8ec5ff',
      },
      boxShadow: {
        soft: '0 20px 60px rgba(4, 10, 20, 0.45)',
      },
      backgroundImage: {
        glow: 'radial-gradient(circle at top, rgba(77,163,255,0.22), transparent 42%)',
      },
    },
  },
  plugins: [],
};
export default config;
