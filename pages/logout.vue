<script setup lang="ts">
import { onMounted } from 'vue'
const authUser = useAuthUserStore()

onMounted(() => {
  authUser.logout()
})
</script>

<template>
  <div>
    <p>Signing you out...</p>
  </div>
</template>