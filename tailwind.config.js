/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        'magic-purple': '#6C63FF',
        'coin-gold': '#FFD700',
        'night-blue': '#1A1A2E',
        'card-blue': '#16213E',
        'deep-blue': '#0F3460',
        'lock-purple': '#2C2C54',
        'success': '#00C851',
        'error': '#FF4444',
      },
      fontSize: {
        'shop-title': '3.5vw',
        'dialogue': '2.8vw',
        'question': '2.4vw',
        'product': '2.0vw',
        'hint': '1.8vw',
        'progress': '1.5vw',
      },
      borderRadius: {
        'card': '16px',
        'bubble': '20px',
        'button': '12px',
      }
    }
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: false,
  }
}
