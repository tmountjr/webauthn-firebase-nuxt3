<script setup lang="ts">
import { ref } from 'vue'
const themeStore = useThemeStore()
const authUserStore = useAuthUserStore()
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
    <v-navigation-drawer v-if="useNavDrawer" v-model="drawer">
      <v-list>
        <div v-if="authUserStore.isAuthenticated">
          <v-list-item
            prepend-icon="mdi-account"
            :title="authUserStore.profile.name"
            :subtitle="authUserStore.user?.email || ''"
          ></v-list-item>
          <v-divider />
          <v-list density="compact" nav>
            <v-list-item prepend-icon="mdi-briefcase-account" to="/profile">Profile</v-list-item>
            <v-list-item prepend-icon="mdi-logout" to="/logout">Log Out</v-list-item>
          </v-list>
          <v-divider />
        </div>
        <v-list-item prepend-icon="mdi-home" to="/">Home Page</v-list-item>
        <v-list-item v-if="!authUserStore.isAuthenticated" prepend-icon="mdi-login" to="/login">Log In</v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar>
      <v-app-bar-nav-icon v-if="useNavDrawer" @click="toggleDrawer" />
      <v-toolbar-title>Webauthn + Firebase + Nuxt3</v-toolbar-title>
      <div v-if="authUserStore.isAuthenticated">
        <v-btn icon="mdi-logout" to="/logout" />
      </div>
      <v-btn :icon="themeStore.themeIcon" @click="themeStore.toggleTheme"></v-btn>
    </v-app-bar>

    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>
