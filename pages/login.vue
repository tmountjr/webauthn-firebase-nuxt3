<script setup lang="ts">
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

const currentChallenge = ref('')

const actionStep = computed(() => step.value < 3 ? 'Continue' : 'Back')

const back = () => {
  if (step.value > 1) {
    step.value = step.value - 1
  }
}

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
        // The getFbUid and getCredentials will populate the store with the necessary values.
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

    // PART 1: Authentication Options
    const { startAuthentication } = await import('@simplewebauthn/browser')
    let optsResponse: Response
    try {
      optsResponse = await fetch('/auth/generate-authentication-options', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          fbUid: userStore.fbUid
        }),
      })
    } catch (e) {
      console.error('error getting auth options', e)
      return
    }
    const opts = await optsResponse.json()
    currentChallenge.value = opts.challenge
    // END PART 1

    // PART 2: Get authentication data from provider (browser)
    let authCredResponse
    try {
      authCredResponse = await startAuthentication(opts)
    } catch (e) {
      console.error('error getting authenticator response', e)
      return
    }
    // END PART 2

    // PART 3: Verify provider's data
    try {
      const verificationResp = await fetch('/auth/verify-authentication', {
        method: 'POST',
        body: JSON.stringify({
          currentChallenge: currentChallenge.value,
          body: authCredResponse,
          fbUid: userStore.fbUid,
          withToken: true,
        }),
        headers: {
          'content-type': 'application/json'
        }
      })

      const { verified, token } = await verificationResp.json()
      if (verified) {
        console.log('TODO: login with token', token)
      } else {
        console.error('authenticator not verified')
      }
    } catch (e) {
      console.error('error while authenticating', e)
    }
    // END PART 3

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
                  <v-text-field label="Email" v-model="userStore.email" variant="underlined" />
                  <div class="d-flex">
                    <v-btn @click="nextStep" class="flex-grow-1">{{ actionStep }}</v-btn>
                  </div>
                </v-window-item>

                <v-window-item :value="2">
                  <v-text-field :value="userStore.email" variant="underlined" disabled></v-text-field>
                  <div class="buttons d-flex">
                    <v-btn @click="back" class="flex-grow-1">Go Back</v-btn>
                    <v-btn @click="nextStep" class="flex-grow-1">Log In With Passkey</v-btn>
                  </div>
                </v-window-item>

                <v-window-item :value="3">
                  <v-text-field type="password" label="Password" variant="underlined" />
                </v-window-item>
              </v-window>
              
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
div.buttons button {
  flex-basis: 50%;
}
</style>