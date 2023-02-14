<script setup lang="ts">
import { storeToRefs } from 'pinia';

const userStore = useAnonUserStore()

definePageMeta({
  layout: 'login',
})

/**
 * Which step to display
 * 1. Email Text Box
 * 2. Log In With Passkey
 * 3. Log In With Password
 */
const step = ref(1)

const actionStep = computed(() => step.value < 3 ? 'Continue' : 'Back')

/**
 * Process:
 * 1. user enters email
 * 2. system checks if email is registered or not.
 *    a. if it is registered, the available credentials are fetched from firebase
 *       1. if there are no credentials, the user is prompted to sign in via a "password" (which is not saved on this demo); next window = "log in with password"
 *       2. if there are credentials, the user is prompted to sign in via passkey; next window = "log in with authenticator"
 *    b. if it is not registered, an account will be created and the user is prompted to sign in via a "password" (which is not saved on this demo); next window = "log in with password"
 */
const nextStep = async () => {
  if (step.value === 1) {
    // User has just entered an email, check if it exists.
    await userStore.getFbUid()
    if (userStore.emailExists) {
      await userStore.getCredentials()
      if (userStore.hasUserCreds) {
        // valid user, has authentication devices
        step.value = 2
      } else {
        // valid user, has no authentication devices
        step.value = 3
      }
    } else {
      // not valid user
      step.value = 3
    }
  } else if (step.value === 2) {
    // Handle click event for logging in with passkey
  } else if (step.value === 3) {
    // Handle click event for logging in with password
    // Account may not exist at this point.
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
                  <v-text-field label="Email" v-model="userStore.email" variant="solo" />
                </v-window-item>

                <v-window-item :value="2">
                  <v-btn block @click="nextStep">Log In With Passkey</v-btn>
                </v-window-item>

                <v-window-item :value="3">
                  <v-text-field type="password" label="Password" variant="solo" />
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
