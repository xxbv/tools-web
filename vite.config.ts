import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
// import { seoperender } from "./ssr.config";  // ← 临时注释掉，防止 prerender 导致构建失败

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  let env = loadEnv(mode, process.cwd())
  return {
    define: {
      'process.env.NODE_ENV': JSON.stringify('production')
    },
    plugins: [
      vue(),
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // Specify symbolId format
        symbolId: 'icon-[dir]-[name]',
      }),
      // seoperender()  // ← 注释掉这一行，禁用预渲染插件（常见导致 Cloudflare Pages 隐形失败/超时/内存超）
    ],
    resolve: {
      alias: {
        "@": path.resolve("./src"), // 原有别名：@ 指向 src
        // v-code-diff alias 已移除，因为依赖已删
      }
    },
    build: {
      sourcemap: false,          // 关闭 sourcemap，减少构建内存消耗
      minify: 'terser',          // 使用 terser 压缩（默认 esbuild 更快，但 terser 更稳）
      terserOptions: {
        compress: true,
        mangle: true,
      },
      chunkSizeWarningLimit: 2000,  // 增大 chunk 警告阈值，避免无关警告
    },
    server: {
      host: env.VITE_HOST,
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_SERVE,
          changeOrigin: true,
        },
      }
    }
  }
})
