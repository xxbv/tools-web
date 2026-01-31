import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
// import { seoperender } from "./ssr.config";  // 临时注释掉，防止预渲染插件导致构建卡住或内存超

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
      // seoperender()  // ← 注释掉这一行，避免 prerender 可能引起的隐形失败
    ],
    resolve: {
      alias: {
        "@": path.resolve("./src"), // 只保留原有 @ 别名
        // v-code-diff alias 已完全删除，避免 ENOENT 错误
      }
    },
    build: {
      sourcemap: false,              // 关闭 sourcemap，节省构建资源
      minify: 'terser',              // 使用 terser 压缩
      chunkSizeWarningLimit: 2000,   // 增大警告阈值，避免无关问题
      target: 'es2020',              // 兼容更好
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
