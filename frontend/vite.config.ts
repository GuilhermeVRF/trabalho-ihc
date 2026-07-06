import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: [
      'enthusiastic-education-production-78de.up.railway.app',
    ],
  },
})