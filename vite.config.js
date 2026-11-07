import process from 'node:process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The app calls the API at /v1 (same origin). In dev and preview, forward
// those requests to the Bilge API; override with BILGE_API_URL.
const api = process.env.BILGE_API_URL || 'http://localhost:5080'
const proxy = { '/v1': { target: api, changeOrigin: true } }

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { proxy },
  preview: { proxy },
})
