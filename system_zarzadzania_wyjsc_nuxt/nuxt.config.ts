// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui','@nuxtjs/color-mode', '@nuxtjs/supabase'],
  colorMode: {
    classSuffix: '' // Wymagane przez Tailwind v4 / Nuxt UI v3
  },
  supabase: {
    redirect: false // Wyłącza automatyczne przekierowanie do strony logowania
  },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      supabaseUrl: "",
      supabaseKey: "",
    },
  },
})
