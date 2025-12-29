/* eslint-env node */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class', // <--- WAJIB ADA: Biar kita bisa kontrol manual
  theme: {
    extend: {
      colors: {
        // Palet Light Mode (Warna terang)
        'cream': '#FEFAE0',
        'sage': '#E0E5B6',
        'olive': '#606C38',
        'forest': '#283618',
        'earth': '#BC6C25',
        'sand': '#DDA15E',
        'pale': '#FAEDCE',
        
        // Palet Dark Mode (Warna gelap)
        'dark-bg': '#0f172a',      // Background utama gelap
        'dark-card': '#1e293b',    // Background kartu/sidebar gelap
        'dark-border': '#334155',  // Garis tepi gelap
        'dark-text': '#f1f5f9',    // Teks utama terang (untuk di background gelap)
        'dark-sub': '#94a3b8',     // Teks secondary abu-abu
      }
    },
  },
  plugins: [require('tailwind-scrollbar-hide')], // Pastikan kamu sudah install ini: npm install tailwind-scrollbar-hide
}