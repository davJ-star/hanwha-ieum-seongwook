import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import next from 'vite-plugin-next'

export default defineConfig({
  plugins: [react(), next()],
  //plugins: [react(), next()]: Next.js와 React를 Vite로 빌드할 수 있도록 설정
  server: {
    port: 5173,
  },
  //server: { port: 5173 }: Vite 서버가 5173번 포트에서 실행되도록 설정(기본값)
})
