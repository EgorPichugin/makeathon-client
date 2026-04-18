<template>
  <NConfigProvider :theme-overrides="themeOverrides">
    <NuxtPage />
  </NConfigProvider>
</template>

<script setup lang="ts">
import type { GlobalThemeOverrides } from 'naive-ui'
import { NConfigProvider } from 'naive-ui'

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#0f766e',
    primaryColorHover: '#115e59',
    primaryColorPressed: '#134e4a',
    borderRadius: '18px',
    fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif'
  },
  Card: {
    borderRadius: '28px'
  },
  Input: {
    borderRadius: '18px'
  },
  Button: {
    borderRadius: '16px'
  }
}
</script>
