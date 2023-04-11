/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    container: {
      center: true
    },
    extend: {
      primary: '#301E5F',
      secondary: '#F8F8F8',
      lightPurple: '#6A33F8',
      check: '#6A33FF'
    }
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.container': {
          maxWidth: '100%',
          '@screen sm': {
            maxWidth: '640px'
          },
          '@screen md': {
            maxWidth: '768px'
          },
          '@screen lg': {
            maxWidth: '1100px'
          }
        }
      })
    }
  ]
}
