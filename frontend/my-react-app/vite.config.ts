// vite.config.js (혹은 vite.config.ts)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
//import next from 'vite-plugin-next'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    //next(), // Next.js 지원 플러그인
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },
  server: {
    port: 5174,      // 기존 5174 유지
    host: true,      // 외부 IP 접속 허용
    open: false,     // false: 브라우저 자동 열림 비활성화
    cors: true,
  },
})


// // Vite 설정 파일(필요한 설정 추가)

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from 'path'

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'),
//       '@components': path.resolve(__dirname, './src/components'),
//       '@pages': path.resolve(__dirname, './src/pages'),
//       '@styles': path.resolve(__dirname, './src/styles')
//     }
//   },
//   server: {
//     port: 5174,
//     host: true,
//     open: true,
//     cors: true
//   }
// })
