import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    theme: {
        extend: {
          colors: {
            'primary': '#1D4ED8',
            'secondary': '#9333EA',
            'gray-dark': '#1F2937',
            'gray-light': '#F3F4F6',
          },
        },
      },
  plugins: [react(),tailwindcss()],
})
