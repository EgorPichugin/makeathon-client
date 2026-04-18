<template>
  <NConfigProvider :theme="darkTheme" :theme-overrides="themeOverrides">
    <NuxtPage />
  </NConfigProvider>
</template>

<script setup lang="ts">
import type { GlobalThemeOverrides } from 'naive-ui'
import { NConfigProvider, darkTheme } from 'naive-ui'

useHead({
  title: 'Spherecast — AI Ingredient Agent',
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Inter+Tight:wght@400;500;600;700&display=swap'
    }
  ]
})

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#6aa8ff',
    primaryColorHover: '#8ec0ff',
    primaryColorPressed: '#3b82f6',
    primaryColorSuppl: '#6aa8ff',
    borderRadius: '12px',
    fontFamily:
      '"Inter Tight", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
    bodyColor: 'transparent',
    textColorBase: '#e7ecf5'
  },
  Card: { borderRadius: '20px' },
  Input: {
    borderRadius: '12px',
    color: 'rgba(255,255,255,0.03)',
    colorFocus: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderHover: '1px solid rgba(106,168,255,0.45)',
    borderFocus: '1px solid rgba(106,168,255,0.6)',
    boxShadowFocus: '0 0 0 2px rgba(106,168,255,0.18)'
  },
  Button: { borderRadius: '999px' }
}
</script>

<style>
html,
body,
#__nuxt {
  margin: 0;
  padding: 0;
  min-height: 100%;
  background: #05070d;
  color: #e7ecf5;
  font-family: 'Inter Tight', Inter, -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

a {
  color: inherit;
  text-decoration: none;
}
</style>
