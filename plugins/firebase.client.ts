import { getAuth } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig()
  
  const firebaseConfig = {
    apiKey: config.FIREBASE_API_KEY,
    authDomain: config.FIREBASE_AUTH_DOMAIN,
    projectId: config.FIREBASE_PROJECT_ID,
    storageBucket: config.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: config.FIREBASE_MESSAGING_SENDER_ID,
    appId: config.FIREBASE_APP_ID,
    databaseURL: config.FIREBASE_DATABASE_URL,
  }

  const fbApp = initializeApp(firebaseConfig)
  const auth = getAuth(fbApp)
  const database = getDatabase(fbApp)

  nuxtApp.vueApp.provide('auth', auth)
  nuxtApp.provide('auth', auth)

  nuxtApp.vueApp.provide('database', database)
  nuxtApp.provide('database', database)
})
