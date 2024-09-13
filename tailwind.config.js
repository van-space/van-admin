/**
 * @format
 * @type {import('tailwindcss').Config}
 */

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        'light-mode': { raw: '(prefers-color-scheme: light)' },
        'dark-mode': { raw: '(prefers-color-scheme: dark)' },
        phone: { raw: '(max-width: 768px)' },
        desktop: { raw: '(min-width: 1024px)' },
        tablet: { raw: '(max-width: 1023px)' },
      },
      zIndex: {
        '-10': -10,
        '-1': -1,
        0: 0,
        1: 1,
        10: 10,
        20: 20,
        30: 30,
        40: 40,
        50: 50,
        60: 60,
        70: 70,
        80: 80,
        90: 90,
        100: 100,
        auto: 'auto',
      },
      colors: {
        primary: {
          default: 'var(--color-primary)',
          deep: 'var(--color-primary-deep)',
          shallow: 'var(--color-primary-shallow)',
        },
        gray$: {
          default: '#ddd',
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
