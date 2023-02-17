<script setup lang="ts">
const userStore = useAnonUserStore()
const authUserStore = useAuthUserStore()

onMounted(() => {
  authUserStore.attachListeners()
})

definePageMeta({
  layout: 'login',
})

const password = ref('')

const step = ref(1)
const currentChallenge = ref('')
const actionStep = computed(() => step.value < 3 ? 'Continue' : 'Back')

const back = () => {
  if (step.value == 2 || step.value == 3) {
    step.value = 1
  }
}

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
      const verificationResp: Response = await fetch('/auth/verify-authentication', {
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
        try {
          await authUserStore.tokenAuth(token)
          navigateTo('/profile')
        } catch (authE) {
          console.error('unable to log in', authE)
        }
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
    if (userStore.emailExists) {
      // Try logging in with password
      try {
        await authUserStore.loginUser(userStore.email, password.value)
        navigateTo('/profile')
      } catch (e: any) {
        console.error('Unable to log in:', e.code)
        // TODO: nicer message display
      }
    } else {
      // Create the account
      try {
        await authUserStore.createUser(userStore.email, password.value)
        navigateTo('/profile')
      } catch (e: any) {
        console.error('Unable to create account:', e.code)
      }
    }
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
                    <v-btn @click="nextStep">{{ actionStep }}</v-btn>
                  </div>
                </v-window-item>

                <v-window-item :value="2">
                  <v-text-field :value="userStore.email" variant="underlined" disabled></v-text-field>
                  <div class="buttons d-flex">
                    <v-btn @click="back">Go Back</v-btn>
                    <v-btn @click="nextStep">Log In With Passkey</v-btn>
                  </div>
                </v-window-item>

                <v-window-item :value="3">
                  <v-text-field type="password" label="Password" variant="underlined" v-model="password" />
                  <div class="buttons d-flex">
                    <v-btn @click="back">Go Back</v-btn>
                    <v-btn @click="nextStep">{{ userStore.emailExists ? 'Log In With Password' : 'Create Account' }}</v-btn>
                  </div>
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
button {
  margin: 0 0.5rem;
  flex: 1;
}
</style>