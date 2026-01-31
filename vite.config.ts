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
        "@": path.resolve("./src"), // 原有别名：@ 指向 src

        // 【关键修复】强制指向 v-code-diff 的可能入口，绕过 package.json 的错误 exports
        'v-code-diff': path.resolve(__dirname, 'node_modules/v-code-diff/index.js')
        // 如果这个路径不行，可以换成下面注释的（逐个测试）：
        // 'v-code-diff': path.resolve(__dirname, 'node_modules/v-code-diff/src/index.js'),
        // 'v-code-diff': path.resolve(__dirname, 'node_modules/v-code-diff/lib/index.js'),
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
