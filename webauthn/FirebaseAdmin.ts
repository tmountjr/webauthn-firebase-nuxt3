import admin from 'firebase-admin'
import { FirebaseDevice, Device } from './Device'
import { App, initializeApp, getApp, cert } from 'firebase-admin/app'

const { FIREBASE_DATABASE_URL = '', GAPP_CREDENTIALS = '{}' } = process.env
const ADMIN_APP_NAME = 'firebase-admin-app'

/**
 * Initialize and return the Firebase Admin SDK.
 * @returns An instance of the Firebase Admin SDK
 */
function fbAdminApp() {
  let adminApp: App
  try {
    adminApp = getApp(ADMIN_APP_NAME)
  } catch (e) {
    const creds = JSON.parse(GAPP_CREDENTIALS)
    creds.private_key = creds.private_key.replace(/\\n/gm, '\n')
    adminApp = initializeApp({
      credential: cert(creds),
      databaseURL: FIREBASE_DATABASE_URL,
    }, ADMIN_APP_NAME)
  }
  return adminApp
}

export async function userDevices(fbUid: string): Promise<Device[]> {
  // Ensure the admin app has been set up
  const adminApp = fbAdminApp()
  const db = admin.database(admin.app(adminApp.name))
  const ref = db.ref(`/users/${fbUid}/credentials`)
  const snapshot = await ref.once('value')
  const devices = convertFirebaseDevices(snapshot.val())
  return devices
}

export async function authToken(fbUid: string): Promise<string> {
  const adminApp = fbAdminApp()
  const auth = admin.auth(admin.app(adminApp.name))
  const token = await auth.createCustomToken(fbUid)
  return token
}

/**
 * Convert serialized data in a list of devices into native types.
 * @param devices The list of devices from Firebase (serialized).
 * @returns The same list of devices in native formats.
 */
export function convertFirebaseDevices(devices: FirebaseDevice[]): Device[] {
  const output = devices.map(device => {
    return {
      counter: device.counter,
      credentialID: new Uint8Array(device.credentialID),
      credentialIdSerialized: device.credentialIdSerialized,
      credentialName: device.credentialName,
      credentialPublicKey: new Uint8Array(device.credentialPublicKey),
      transports: device.transports,
    }
  })
  return output
}
