import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],


  // reduce lag while loading big glb/gltf files
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei'],
  },

  build: {
    // 큰 에셋 처리(필요시 조정)
    assetsInlineLimit: 0,
  },
})