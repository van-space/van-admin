import { pluginReact } from '@rsbuild/plugin-react'

import { defineConfig, loadEnv } from '@rsbuild/core'
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin'

import PKG from './package.json'

const { parsed, publicVars } = loadEnv()
const isDev = process.env.NODE_ENV === 'development'
export default defineConfig({
  output: {
    // assetPrefix: '.',
  },
  source: {
    alias: {},
    define: publicVars,
  },
  html: {
    template: 'public/index.html',
    templateParameters: {
      MX_SPACE_ADMIN_DASHBOARD_VERSION_INJECT: `<script>window.version = '${PKG.version}';</script>`,
      ENV_INJECT: `<script id="env_injection">window.injectData = {WEB_URL:'${
        parsed.VITE_APP_WEB_URL || ''
      }', GATEWAY: '${parsed.VITE_APP_GATEWAY || ''}',BASE_API: '${
        parsed.VITE_APP_BASE_API || ''
      }'}</script>`,
    },
  },
  plugins: [pluginReact()],

  server: {
    port: 10086,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:2333',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
  tools: {
    rspack(_, { appendPlugins }) {
      if (process.env.RSDOCTOR) {
        appendPlugins(
          new RsdoctorRspackPlugin({
            // 插件选项
          }),
        )
      }
    },
  },
})
