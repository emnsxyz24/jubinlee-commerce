import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2026-07-30',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', 'shadcn-nuxt'],
  shadcn: {
    prefix: '',
    componentDir: './components/ui',
  },
  css: ['vue-sonner/style.css', '~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: true,
    },
  },
  routeRules: {
    '/api/v1/**': { proxy: process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/api/v1/**` : 'http://localhost:3001/api/v1/**' },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://api.mikaeru.my.id/api/v1',
    },
  },
  app: {
    head: {
      title: 'Jubi & Lee — Modern Editorial Fashion',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Discover curated luxury apparel and modern wardrobe essentials.' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: 'https://res.cloudinary.com/nfofcl3h/image/upload/v1787751718/dark-logo.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap',
        },
      ],
    },
  },
});
