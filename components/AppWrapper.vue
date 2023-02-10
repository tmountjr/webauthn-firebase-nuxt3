<script setup lang="ts">
import { ref } from 'vue'
const themeStore = useThemeStore()
defineProps({
  useNavDrawer: Boolean
})
const drawer = ref(false)
const toggleDrawer = () => {
  drawer.value = !drawer.value
}
</script>

<template>
  <v-app :theme="themeStore.theme">
    <v-navigation-drawer v-if="useNavDrawer" v-model="drawer"></v-navigation-drawer>
    <v-app-bar>
      <v-app-bar-nav-icon v-if="useNavDrawer" @click="toggleDrawer" />
      <v-toolbar-title>Webauthn + Firebase + Nuxt3</v-toolbar-title>
      <v-btn :icon="themeStore.themeIcon" @click="themeStore.toggleTheme"></v-btn>
    </v-app-bar>

    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>