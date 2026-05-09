module.exports = {
  content: [
    "./index.html",
    "./core/**/*.js",
    "./apps/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        vazir: ['Vazirmatn', 'sans-serif'],
      },
      colors: {
        os: {
          taskbar: 'rgba(15, 23, 42, 0.6)',
          window: 'rgba(255, 255, 255, 0.95)',
          header: 'rgba(243, 244, 246, 0.9)',
          primary: '#3b82f6',
        }
      }
    },
  },
  plugins: [],
}