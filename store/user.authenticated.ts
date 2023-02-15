import { ref, computed } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref as dbRef, onValue, Unsubscribe, get, set } from 'firebase/database'
import {
  signInWithCustomToken,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'

export const useAuthUserStore = defineStore('user.authenticated', () => {
  const { $auth, $database } = useNuxtApp()
  let unsubscribeProfile: Unsubscribe | undefined

  // Refs
  /** The Firebase Auth user */
  const user = ref<User>()
  const logoutRedirectDest = ref('/login')
  const profile = ref()

  // Computed
  const isAuthenticated = computed<boolean>(() => user.value !== undefined)

  // Methods
  const tokenAuth = async (token: string) => {
    await signInWithCustomToken($auth, token)
  }

  const createUser = async (email: string, password: string) => {
    await createUserWithEmailAndPassword($auth, email, password)
  }

  const loginUser = async (email: string, password: string) => {
    await signInWithEmailAndPassword($auth, email, password)
  }

  const logout = async (redirectTo: string = logoutRedirectDest.value) => {
    logoutRedirectDest.value = redirectTo
    await signOut($auth)
  }

  const saveToProfile = async () => {
    if (user.value && profile.value) {
      const profileRef = dbRef($database, `/users/${user.value.uid}/profile`)
      await set(profileRef, profile.value)
    }
  }

  const attachListeners = async () => {
    $auth.onAuthStateChanged(async (authUser: User | null) => {
      console.debug('Auth State Changed')
      if (authUser) {
        user.value = authUser

        // Since the state has changed, we need to refresh the profile data.
        const profileRef = dbRef($database, `/users/${authUser.uid}/profile`)
        unsubscribeProfile = onValue(profileRef, (snapshot) => {
          console.debug('Profile Information Changed')
          const data = snapshot.val()
          profile.value = data
        })
      } else {
        user.value = undefined
        profile.value = undefined
        if (unsubscribeProfile) {
          unsubscribeProfile()
        }

        // Since we're logged out, navigate back to the user-requested page
        navigateTo(logoutRedirectDest.value)
      }
    })

    // If we have a user available, get the profile data
    if (user.value) {
      const profileSnapshot = await get(dbRef($database, `/users/${user.value.uid}/profile`))
      if (profileSnapshot.exists()) {
        profile.value = profileSnapshot.val()
      }
    }
  }

  return {
    user,
    profile,
    isAuthenticated,
    tokenAuth,
    createUser,
    loginUser,
    logout,
    saveToProfile,
    attachListeners,
  }
}, { persist: true })

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthUserStore, import.meta.hot))
}