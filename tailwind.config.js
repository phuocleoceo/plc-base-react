/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        'chakra-blue': '#0061cc',
        'c-text': 'var(--c-text)',
        'c-1': 'var(--c-1)',
        'c-2': 'var(--c-2)',
        'c-4': 'var(--c-4',
        'c-3': 'var(--c-3)',
        'c-5': 'var(--c-5)',
        'c-6': 'var(--c-6)',
        'c-7': 'var(--c-7)'
      },
      boxShadow: {
        issue: '0 1px 2px 0 #091e4240',
        list: '0 0 2px 0 #091e4230'
      },
      borderWidth: {
        2.5: '2.5px'
      }
    }
  },
  plugins: []
}
