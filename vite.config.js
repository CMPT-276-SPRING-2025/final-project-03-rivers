import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [
    tailwindcss(), // tailwindcss
    react(), // react
  ],
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.js', // Create this file
  }
})