import { defineNuxtConfig } from 'nuxt/config'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Pullonath',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      script: [
        // <script src="https://myawesome-lib.js"></script>
        // { src: 'https://awesome-lib.js' }
      ],
      link: [
        // <link rel="stylesheet" href="https://myawesome-lib.css">
        // { rel: 'stylesheet', href: 'https://awesome-lib.css' }
      ],
      // please note that this is an area that is likely to change
      style: [
        // <style type="text/css">:root { color: red }</style>
        // { children: ':root { color: red }', type: 'text/css' }
      ]
    }
  },
  css: ["~/assets/css/styles.css"],
  // buildModules: ['@nuxtjs/tailwindcss'],
  // tailwindcss: {
  //   // jit: true,
  //   // add '~tailwind.config` alias
  //   exposeConfig: true
  // },
  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss'
    // '@nuxtjs/color-mode', 
    // '@nuxt/image-edge',
  ],
  devServerHandlers: [],
  // colorMode: {
  //   preference: 'light', // default value of $colorMode.preference
  //   fallback: 'light', // fallback value if not system preference found
  //   hid: 'nuxt-color-mode-script',
  //   globalName: '__NUXT_COLOR_MODE__',
  //   componentName: 'ColorScheme',
  //   classPrefix: '',
  //   classSuffix: '',
  //   storageKey: 'nuxt-color-mode'
  // },

  runtimeConfig: {
    public: {
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
      CLOUDINARY_UPLOAD_PRESET: process.env.CLOUDINARY_UPLOAD_PRESET,
      TEMP_PASSWORD: process.env.TEMP_PASSWORD,
      WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN,
      OPENAI_KEY: process.env.OPENAI_KEY,
      SENDGRID_KEY: process.env.SENDGRID_KEY,
    },
    private: {
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
      CLOUDINARY_UPLOAD_PRESET: process.env.CLOUDINARY_UPLOAD_PRESET,
      TEMP_PASSWORD: process.env.TEMP_PASSWORD,
      WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN,
      OPENAI_KEY: process.env.OPENAI_KEY,
      SENDGRID_KEY: process.env.SENDGRID_KEY,
    }
  },
})
