/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      maxWidth: {
        page: '1700px',
      },
      fontFamily: {
        display: ['MiSans', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        body: ['MiSans', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
      },
      colors: {
        ink: '#0C0C0C',
        bone: '#D7E2EA',
      },
      boxShadow: {
        glow: '0 30px 120px rgba(49, 91, 255, 0.18)',
      },
    },
  },
  plugins: [],
};
