import { ref, computed } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { isoBase64URL } from '@simplewebauthn/server/helpers'
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
  const initialized = ref(false)
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
    const creds = await createUserWithEmailAndPassword($auth, email, password)

    // Once the user has been created, they need a map entry as well
    const userKey = isoBase64URL.fromString(email)
    await set(dbRef($database, `/users/${creds.user.uid}/email`), email)
    await set(dbRef($database, `/map/${userKey}`), creds.user.uid)
  }

  const loginUser = async (email: string, password: string) => {
    await signInWithEmailAndPassword($auth, email, password)
  }

  const logout = async (redirectTo: string = logoutRedirectDest.value) => {
    logoutRedirectDest.value = redirectTo
    await signOut($auth)
    user.value = undefined
    profile.value = undefined
    if (unsubscribeProfile) {
      unsubscribeProfile()
      unsubscribeProfile = undefined
    }
  }

  const saveToProfile = async () => {
    if (user.value && profile.value) {
      const profileRef = dbRef($database, `/users/${user.value.uid}/profile`)
      await set(profileRef, profile.value)
    }
  }

  const attachListeners = () => {
    $auth.onAuthStateChanged(async (authUser) => {
      console.debug('Auth State Changed')
      if (authUser) {
        console.debug('New Auth State: logged in')
        user.value = authUser

        // Since the state has changed, we need to refresh the profile data.
        const profileRef = dbRef($database, `/users/${authUser.uid}/profile`)
        unsubscribeProfile = onValue(profileRef, (snapshot) => {
          console.debug('Profile Information Changed')
          const data = snapshot.val()
          profile.value = data
        })
      } else {
        console.debug('New Auth State: logged out')
        await logout()

        // Since we're logged out, navigate back to the user-requested page
        navigateTo(logoutRedirectDest.value)
      }
    })

    // If we have a user available, get the profile data
    if (user.value) {
      get(dbRef($database, `/users/${user.value.uid}/profile`))
        .then(profileSnapshot => {
          console.debug('Profile Updated')
          if (profileSnapshot.exists()) {
            profile.value = profileSnapshot.val()
          }
        })
    }

    initialized.value = true
  }

  return {
    initialized,
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
