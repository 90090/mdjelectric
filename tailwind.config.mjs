/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#f1c600',
          light:   '#f5d633',
          dark:    '#c9a800',
        },
        coal: {
          DEFAULT: '#111111',
          mid:     '#1A1A1A',
          light:   '#252525',
        },
        ash: {
          DEFAULT: '#2E2E2E',
          light:   '#3D3D3D',
        },
      },
      fontFamily: {
        display: ['Barlow Condensed', 'sans-serif'],
        body:    ['Barlow', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
