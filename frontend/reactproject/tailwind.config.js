/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f7f4',
          100: '#dcebe1',
          400: '#3f8a63',
          600: '#2d6a4f',
          700: '#1b4332',
          800: '#123023',
          900: '#0b1f17'
        },
        clay: {
          100: '#fbe9d7',
          300: '#f0c090',
          500: '#df9c4f',
          600: '#c2703a',
          700: '#9c5729'
        },
        haze: {
          50: '#f6f4fb',
          100: '#eeeaf9',
          200: '#e2ddf2'
        },
        ink: '#12181f'
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif']
      },
      boxShadow: {
        soft: '0 20px 60px -20px rgba(27, 67, 50, 0.25)',
        card: '0 10px 30px -12px rgba(18, 24, 31, 0.15)'
      },
      backgroundImage: {
        'grain': "radial-gradient(circle at 1px 1px, rgba(18,24,31,0.06) 1px, transparent 0)"
      }
    },
  },
  plugins: [],
}
