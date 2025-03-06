/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jax,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#08090a',
        titleColor: '#f7f8f8',
        subtitleColor: '#8a8f98',
      },
      fontFamily: {
        inter: ['var(--font-inter)'],
      },
      boxShadow: {
        sm: '0 4px 6px rgba(0, 0, 0, 0.2)',
        md: '0 8px 12px rgba(0, 0, 0, 0.25)',
        lg: '0 12px 24px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
};