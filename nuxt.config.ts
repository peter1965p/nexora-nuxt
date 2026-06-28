export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  ssr: false,
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      plexoraApiUrl: 'https://7hrkm580pb.execute-api.eu-central-1.amazonaws.com',
      devTenantId: 'PLXR-GOD0-MODE-0000-PETE',
    },
  },
  app: {
    head: {
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    },
  },
})
