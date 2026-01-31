import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
// import { seoperender } from "./ssr.config";  // 保持注释，防止潜在问题

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
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
      // seoperender()  // 注释掉，避免预渲染导致构建中断
    ],
    resolve: {
      alias: {
        "@": path.resolve("./src")  // 只保留这个原有别名
        // 没有任何 v-code-diff 相关配置了
      }
    },
    build: {
      sourcemap: false,
      minify: 'terser',
      chunkSizeWarningLimit: 2000,
      target: 'es2020',
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
