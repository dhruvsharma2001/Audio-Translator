import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Optional proxy — uncomment if you prefer not to set VITE_API_URL
    // proxy: {
    //   '/api': 'http://localhost:3001',
    // },
  },
})
