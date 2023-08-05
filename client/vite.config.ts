import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(() => {
  // Cấu hình khác của Vite
  return {
    plugins: [react()],
    server: {
      port: 5001
    },
    css: {
      devSourcemap: true
    },
    resolve: {
      alias: {
        src: path.resolve(__dirname, './src')
      }
    }
  }
})
