<template>
  <NConfigProvider :theme="darkTheme" :theme-overrides="themeOverrides">
    <NuxtPage />
  </NConfigProvider>
</template>

<script setup lang="ts">
import type { GlobalThemeOverrides } from 'naive-ui'
import { NConfigProvider, darkTheme } from 'naive-ui'

useHead({
  title: 'Spherecast — Ingredient Agent',
  link: [
    { rel: 'preconnect', href: 'https://cdn.prod.website-files.com', crossorigin: '' },
    {
      rel: 'preload',
      as: 'font',
      href: 'https://cdn.prod.website-files.com/68d1019362216d12f87a9446/68d1019362216d12f87a948d_Creato%20Display%20Regular.woff2',
      type: 'font/woff2',
      crossorigin: ''
    },
    {
      rel: 'preload',
      as: 'font',
      href: 'https://cdn.prod.website-files.com/68d1019362216d12f87a9446/68d1019362216d12f87a948e_Creato%20Display%20Medium.woff2',
      type: 'font/woff2',
      crossorigin: ''
    }
  ]
})

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#9ac8ff',
    primaryColorHover: '#b8d9ff',
    primaryColorPressed: '#6aa8ff',
    primaryColorSuppl: '#9ac8ff',
    borderRadius: '0px',
    fontFamily:
      '"Creato Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
    fontFamilyMono:
      '"JetBrains Mono", ui-monospace, Menlo, Consolas, monospace',
    bodyColor: 'transparent',
    textColorBase: '#e7e8eb'
  },
  Card: { borderRadius: '0px' },
  Input: {
    borderRadius: '0px',
    color: 'rgba(255,255,255,0.02)',
    colorFocus: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(231,232,235,0.12)',
    borderHover: '1px solid rgba(154,200,255,0.45)',
    borderFocus: '1px solid rgba(154,200,255,0.6)',
    boxShadowFocus: '0 0 0 2px rgba(154,200,255,0.14)'
  },
  Button: { borderRadius: '0px' }
}
</script>

<style>
@font-face {
  font-family: 'Creato Display';
  src: url('https://cdn.prod.website-files.com/68d1019362216d12f87a9446/68d1019362216d12f87a948d_Creato%20Display%20Regular.woff2')
    format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Creato Display';
  src: url('https://cdn.prod.website-files.com/68d1019362216d12f87a9446/68d1019362216d12f87a948e_Creato%20Display%20Medium.woff2')
    format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'JetBrains Mono';
  src: url('https://cdn.prod.website-files.com/68d1019362216d12f87a9446/68d1019362216d12f87a9483_JetBrainsMono-Regular.woff2')
    format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

html,
body,
#__nuxt {
  margin: 0;
  padding: 0;
  min-height: 100%;
  height: 100%;
  background: #0e1216;
  color: #e7e8eb;
  font-family: 'Creato Display', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, Arial, sans-serif;
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

::selection {
  background-color: #9ac8ff;
  color: #e7e8eb;
}
</style>
