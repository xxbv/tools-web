import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
import { seoperender } from "./ssr.config";

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
      seoperender()
    ],
    resolve: {
      alias: {
        "@": path.resolve("./src"), // 相对路径别名配置，使用@替代src
        
        // 强制 alias 解决 v-code-diff 入口解析失败（常见修复方案）
        // 尝试 dist/index.js（大多数组件包用这个）
        'v-code-diff': path.resolve(__dirname, 'node_modules/v-code-diff/dist/index.js'),
        
        // 如果上面不行，备选1：直接指向 src/index.js（如果包有源码暴露）
        // 'v-code-diff': path.resolve(__dirname, 'node_modules/v-code-diff/src/index.js'),
        
        // 备选2：如果包用 ESM 格式（.mjs）
        // 'v-code-diff': path.resolve(__dirname, 'node_modules/v-code-diff/dist/index.mjs'),
      }
    },
    server: {
      host: env.VITE_HOST,
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_SERVE,
          changeOrigin: true,
          // bypass(req, res, options) {
          //   const proxyUrl = new URL(options.rewrite(req.url) || '', (options.target) as string)?.href || ''
          //   req.headers['x-req-proxyUrl'] = proxyUrl;
          //   res.setHeader("x-res-proxyUrl", proxyUrl)
          // }
        },
      }
    }
  }
})
