import { ref, child, get } from 'firebase/database'
import { Device, FirebaseDevice, convertFirebaseDevices } from '../webauthn/Device'

export default function() {
  const { $database } = useNuxtApp()

  /**
   * Get data from Firebase once.
   * @param path The path to fetch
   * @returns The data that lives at {path}
   */
  async function getPath(path: string): Promise<any> {
    const userRef = ref($database)
    const snapshot = await get(child(userRef, path))
    if (snapshot.exists()) {
      return snapshot.val()
    }
    return
  }

  /**
   * Get a list of authentication devices from Firebase.
   * @param fbUid The Firebase User ID.
   * @returns A list of authentication devices registered to the
   */
  async function credentials(fbUid: string): Promise<Device[] | undefined> {
    const fbCreds: FirebaseDevice[] = await getPath(`/users/${fbUid}/credentials`)
    const nativeCreds = convertFirebaseDevices(fbCreds)
    return nativeCreds
  }

  return { credentials }
}