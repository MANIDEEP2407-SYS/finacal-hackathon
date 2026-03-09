/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        hdfc: {
          blue:        '#224c87',
          red:         '#da3832',
          grey:        '#919090',
          'blue-dark':  '#1a3a6b',
          'blue-light': '#e8eef7',
          'blue-mid':   '#3d6aad',
          'red-light':  '#fce8e8',
          'grey-light': '#f4f4f4',
          'grey-dark':  '#3a3a3a',
        },
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', 'Arial', 'Verdana', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
