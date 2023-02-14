import { convertFirebaseDevices, Device } from './Device'
import { App, initializeApp, getApp, cert } from 'firebase-admin/app'
import { getDatabase } from 'firebase-admin/database'
import { getAuth } from 'firebase-admin/auth'

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
  const db = getDatabase(adminApp)
  const ref = db.ref(`/users/${fbUid}/credentials`)
  const snapshot = await ref.once('value')
  const devices = convertFirebaseDevices(snapshot.val())
  return devices
}

export async function authToken(fbUid: string): Promise<string> {
  const adminApp = fbAdminApp()
  const auth = getAuth(adminApp)
  const token = await auth.createCustomToken(fbUid)
  return token
}
