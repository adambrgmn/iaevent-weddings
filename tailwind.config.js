const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    extend: {
      colors: {
        black: '#333333',
        white: '#ffffff',
        gray: {
          '100': '#f5f5f5',
          '200': '#eeeeee',
          '300': '#e0e0e0',
          '400': '#bdbdbd',
          '500': '#9e9e9e',
          '600': '#757575',
          '700': '#616161',
          '800': '#424242',
          '900': '#212121',
        },
      },
    },
    fontFamily: {
      sans: ['"Work Sans"', 'sans-serif'],
      serif: defaultTheme.fontFamily.serif,
      display: ['"Advent Pro"', 'sans-serif'],
    },
  },
};
