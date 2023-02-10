<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'

const themeStore = useThemeStore()
const { toggleTheme } = themeStore
const { theme } = storeToRefs(themeStore)
const drawer = ref(false)

const themeIcon = computed(() => theme.value === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night')
const toggleDrawer = () => {
  drawer.value = !drawer.value
}

</script>

<template>
  <v-app :theme="theme">
    <v-navigation-drawer v-model="drawer"></v-navigation-drawer>
    <v-app-bar>
      <v-app-bar-nav-icon @click="toggleDrawer" />
      <v-toolbar-title>Webauthn + Firebase + Nuxt3</v-toolbar-title>
      <v-btn :icon="themeIcon" @click="toggleTheme"></v-btn>
    </v-app-bar>

    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>