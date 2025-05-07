/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Assure-toi que le chemin couvre bien tous tes fichiers React et TypeScript
  ],
  theme: {
    extend: {
      width: {
        '1/7': '14.3%',
        '2/7': '28.6%',
        '3/7': '42.9%',
      },
      height: {
        '1/12': '8.333333%',
        '1/8': '12.5%',
        '6/8': '75%',
        '7/8': '87.5%',
        '1/10': '10%',
        '3/10' : '30%',
        '1/7' : '14.3%',
        '2/7' : '28.6%',
        '6/7': '85.5%',
        '192' : '768px',
      },
      colors:{
        'container':'#5B359B',
        'button-color': '#7D16FF',
        'main-color': '#DAB6FF',
        'second-color': '#FF3769',
        'base-linear-gradient': "linear-gradient(90deg, rgba(85,121,133,1) 0%, rgba(63,103,123,1) 36%, rgba(61,102,122,1) 63%, rgba(59,100,121,1) 74%, rgba(37,83,110,1) 98%)",
        'text-color-default': `#111E20`,
        'validation-button': '#069614',
        'hover-validation-button': '#0c801e',
        'hover-button': '#B77EFF',
        'button-default-color': 'rgb(59 130 246)',
        'hover-button-default-color': 'rgb(37 99 235)',
      },
      backgroundImage: {
        'base-linear-gradient': "linear-gradient(90deg, rgba(85,121,133,1) 0%, rgba(63,103,123,1) 36%, rgba(61,102,122,1) 63%, rgba(59,100,121,1) 74%, rgba(37,83,110,1) 98%)",
      },
      boxShadow: {
        'default': '0 4px 8px rgba(0, 0, 0, 0.1)',
        'input': 'inset 0 1px 3px rgba(0, 0, 0, 0.3)',

      },
      keyframes: {
        reduceWidthRightToLeft: {
          '0%': { width: '100%' },
          '100%': { width: '0' },
        },
        slideInFromLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInFromRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutToLeft: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-100%)', opacity: '0' },
        },
        slideOutToRight: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        }
      },
      animation: {
        'reduce-width-right-to-left': 'reduceWidthRightToLeft 3s linear forwards',
        'slide-in-left': 'slideInFromLeft 0.5s ease-out forwards',
        'slide-in-right': 'slideInFromRight 0.5s ease-out forwards',
        'slide-out-left': 'slideOutToLeft 0.5s ease-in forwards',
        'slide-out-right': 'slideOutToRight 0.5s ease-in forwards',
      },
    },
  },
  plugins: [],
}

