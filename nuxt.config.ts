export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  nitro: {
    preset: 'cloudflare-pages',
  },
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
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css' },
      ],
    },
  },
})
