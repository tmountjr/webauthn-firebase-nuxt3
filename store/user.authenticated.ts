import { ref, computed } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
import {
  signInWithCustomToken,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'

export const useAuthUserStore = defineStore('user.authenticated', () => {
  const { $auth } = useNuxtApp()
  const stateChangeListener = (authUser: User | null) => {
    if (authUser) {
      user.value = authUser
    } else {
      user.value = undefined

      // Since we're logged out, navigate back to the user-requested page
      navigateTo(logoutRedirectDest.value)
    }
  }

  // Refs
  /** The Firebase Auth user */
  const user = ref<User>()
  const logoutRedirectDest = ref('/login')

  // Computed
  const isAuthenticated = computed<boolean>(() => user.value !== undefined)

  // Methods
  const tokenAuth = async (token: string) => {
    $auth.onAuthStateChanged(stateChangeListener)
    await signInWithCustomToken($auth, token)
  }

  const createUser = async (email: string, password: string) => {
    $auth.onAuthStateChanged(stateChangeListener)
    await createUserWithEmailAndPassword($auth, email, password)
  }

  const loginUser = async (email: string, password: string) => {
    $auth.onAuthStateChanged(stateChangeListener)
    await signInWithEmailAndPassword($auth, email, password)
  }

  const logout = async (redirectTo: string = logoutRedirectDest.value) => {
    logoutRedirectDest.value = redirectTo
    $auth.onAuthStateChanged(stateChangeListener)
    await signOut($auth)
  }

  return {
    user,
    isAuthenticated,
    tokenAuth,
    createUser,
    loginUser,
    logout,
  }
}, { persist: true })

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthUserStore, import.meta.hot))
}