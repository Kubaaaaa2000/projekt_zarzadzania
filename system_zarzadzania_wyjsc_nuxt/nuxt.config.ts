// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui','@nuxtjs/color-mode'],
  colorMode: {
    classSuffix: '' // Wymagane przez Tailwind v4 / Nuxt UI v3
  },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true }
})
