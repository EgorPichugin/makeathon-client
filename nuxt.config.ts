// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  build: {
    transpile: ['naive-ui', 'vueuc']
  },
  runtimeConfig: {
    agentBaseUrl: process.env.AGENT_BASE_URL
  },
  vite: {
    resolve: {
      alias: {
        vueuc: 'vueuc/es/index.js'
      }
    },
    optimizeDeps: {
      include: ['naive-ui', 'vueuc/es/index.js']
    },
    ssr: {
      noExternal: ['naive-ui', 'vueuc']
    }
  }
})
