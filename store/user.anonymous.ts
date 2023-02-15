import { ref, computed } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref as dbRef, child, get} from 'firebase/database'
import { isoBase64URL } from '@simplewebauthn/server/helpers'
import { Device, FirebaseDevice, convertFirebaseDevices } from '../webauthn/Device'

/**
 * This store should contain only anonymous user methods, things that can be
 * done by any user
 */
export const useAnonUserStore = defineStore('user.anonymous', () => {
  const { $database } = useNuxtApp()

  const query = async (path: string): Promise<any> => {
    const _dbRef = dbRef($database)
    const snapshot = await get(child(_dbRef, path))
    if (snapshot.exists()) {
      return snapshot.val()
    }
    return
  }


  // Refs
  const email = ref('')
  const emailExists = ref(false)
  const fbUid = ref('')
  const userCreds = ref<Device[]>()
  
  // Computed
  const emailMapKey = computed(() => isoBase64URL.fromString(email.value))
  const hasUserCreds = computed(() => {
    if (userCreds.value && userCreds.value.length > 0) {
      return true
    }
    return false
  })

  // Methods
  const getFbUid = async (mapKey: string = emailMapKey.value): Promise<string | undefined> => {
    const mapRef: string | undefined = await query(`/map/${mapKey}`)
    if (mapRef) {
      emailExists.value = true
      fbUid.value = mapRef
      return mapRef
    }
    emailExists.value = false
    fbUid.value = ''
    return
  }

  const getCredentials = async (uid: string = fbUid.value): Promise<Device[]> => {
    const fbCreds: FirebaseDevice[] = await query(`/users/${uid}/credentials`)
    const nativeCreds = convertFirebaseDevices(fbCreds)
    userCreds.value = nativeCreds
    return nativeCreds
  }

  return {
    email,
    emailExists,
    fbUid,
    userCreds,
    emailMapKey,
    hasUserCreds,
    getFbUid,
    getCredentials
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAnonUserStore, import.meta.hot))
}