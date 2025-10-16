/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0077B6',
        secondary: '#00B4D8',
        accent: '#F77F00',
        surface: '#FFFFFF',
        background: '#F8F9FA',
        success: '#06D6A0',
        warning: '#FFB703',
        error: '#EF476F',
        info: '#48CAE4'
      },
      fontFamily: {
        'display': ['Poppins', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif']
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem'
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.1)',
        'strong': '0 8px 24px rgba(0, 0, 0, 0.15)'
      },
      borderRadius: {
        'DEFAULT': '8px',
        'lg': '12px',
        'xl': '16px'
      }
    },
  },
  plugins: [],
}