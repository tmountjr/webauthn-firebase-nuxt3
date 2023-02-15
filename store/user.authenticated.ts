import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { signInWithCustomToken, User } from 'firebase/auth'

export const useAuthUserStore = defineStore(
  'user.authenticated',
  () => {
    const { $auth } = useNuxtApp()

    // Refs
    /** The Firebase Auth user */
    const user = ref<User>()

    // Computed
    const isAuthenticated = computed<boolean>(() => user.value !== undefined)

    // Methods

    const tokenAuth = async (token: string) => {
      $auth.onAuthStateChanged(authUser => {
        if (authUser) {
          user.value = authUser
        } else {
          user.value = undefined
        }
      })
      await signInWithCustomToken($auth, token)
    }

    return {
      user,
      isAuthenticated,
      tokenAuth
    }
  },
  {
    persist: true,
  }
)