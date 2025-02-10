/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      'sm': '576px',
      'md': '768px',
      'lg': '992px',
      'xl': '1240px',
      '2xl': '1240px',
    },
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(to right, #a855f7, #27ae60)',
      },
      transitionTimingFunction: {
        'custom': 'ease-in-out',
      },
      transitionDuration: {
        'custom': '400ms',
      },
      scale: {
        '105': '1.05', // Tăng nhẹ kích thước khi hover
        '110': '1.10',
      },
      grayscale: {
        60: '0.6', // 50% thang độ xám
      },
      boxShadow: {
        'all-around': '0 2px 2px rgba(0, 0, 0, 0.2), 0 -2px 2px rgba(0, 0, 0, 0.1), 2px 0 2px rgba(0, 0, 0, 0.15), -2px 0 2px rgba(0, 0, 0, 0.15)',
      },
      // colors: {
      //   primary: '#4318FF',
      //   dark: '#1B2559',
      //   light: '#68769F'
      // }
    },
  },
  plugins: [
    require('daisyui'),
  ],
}

