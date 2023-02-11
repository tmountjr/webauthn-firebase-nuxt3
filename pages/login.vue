<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: 'login',
})

const step = ref(1)
const email = ref('')
const password = ref('')

const actionStep = computed(() => step.value == 1 ? 'Continue' : 'Back')
const nextStep = () => {
  if (step.value == 1) {
    step.value = 2
  } else {
    step.value = 1
  }
}
</script>

<template>
  <div>
    <v-row class="justify-center text-center">
      <v-col cols="12" md="4">
        <h1 class="text-h4 font-weight-thin mb-4">Please Log In</h1>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="12" md="4">
        <v-window v-model="step">
          <v-window-item :value="1">
            <v-text-field clearable v-model="email" label="Email Address" variant="solo" />
          </v-window-item>

          <v-window-item :value="2">
            <v-text-field type="password" clearable v-model="password" label="Password" variant="solo" />
          </v-window-item>
        </v-window>
        <v-btn block @click="nextStep">{{ actionStep }}</v-btn>
      </v-col>
    </v-row>
  </div>
</template>
