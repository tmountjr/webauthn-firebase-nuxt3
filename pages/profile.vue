<script setup lang="ts">
const authUserStore = useAuthUserStore()
onMounted(() => {
  authUserStore.attachListeners()
})
definePageMeta({
  middleware: ['auth']
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4">
        <h1>Public Profile</h1>
      </v-col>
    </v-row>

    <v-row v-if="authUserStore.profile">
      <v-col cols="12" md="3">
        <p><strong>Name:</strong></p>
        <v-text-field v-model="authUserStore.profile.name" variant="underlined" />
      </v-col>
      <v-col cols="12" md="3">
        <p><strong>Favorite Color:</strong></p>
        <v-color-picker v-model="authUserStore.profile.favoriteColor" :modes="['rgb']" />
      </v-col>
    </v-row>

    <v-row v-if="authUserStore.profile">
      <v-col cols="12" md="6">
        <v-btn block @click="authUserStore.saveToProfile">Save Profile Information</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>