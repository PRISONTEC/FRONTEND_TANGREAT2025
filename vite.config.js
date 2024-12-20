import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3700,
    host: '172.16.100.143',
  },
  plugins: [react()],
})
