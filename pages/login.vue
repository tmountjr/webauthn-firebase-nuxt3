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
  <div class="d-flex align-center justify-center fill-height">
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-card class="mx-auto" max-width="500">
            <v-card-title class="text-h4 font-weight-thin text-center">
              <span>Please Log In</span>
            </v-card-title>
            <v-card-text>
              <v-window v-model="step">
                <v-window-item :value="1">
                  <v-text-field label="Email" value="you@example.com" variant="solo" />
                </v-window-item>

                <v-window-item :value="2">
                  <v-text-field type="password" v-model="password" label="Password" variant="solo" />
                </v-window-item>
              </v-window>
              <v-btn block @click="nextStep">{{ actionStep }}</v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
