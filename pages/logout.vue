<script setup lang="ts">
import { onMounted } from 'vue'
const authUser = useAuthUserStore()

definePageMeta({
  layout: 'login',
})

onMounted(async () => {
  await authUser.logout()
  navigateTo('/login')
})
</script>

<template>
  <div>
    <p>Signing you out...</p>
  </div>
</template>