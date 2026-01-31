import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
// import { seoperender } from "./ssr.config";  // 临时注释，防止 prerender 潜在问题

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
      // seoperender()  // 注释掉以防隐形失败/超时
    ],
    resolve: {
      alias: {
        "@": path.resolve("./src"), // 保留原有 @ 别名
        // v-code-diff alias 已删除，因为依赖移除，避免 ENOENT 错误
      }
    },
    build: {
      sourcemap: false,  // 关闭 sourcemap 节省资源
      minify: 'terser',
      chunkSizeWarningLimit: 2000,
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
