import { Router } from '@edgio/core'
import { nuxtRoutes } from '@edgio/nuxt-nitro'
import * as auth from './webauthn/authentication'

require('dotenv').config()

const NO_CACHE = {
  browser: {
    maxAgeSeconds: 0,
    serviceWorkerSeconds: 0
  },
  edge: {
    maxAgeSeconds: 0,
    staleWhileRevalidateSeconds: 0
  }
}

export default new Router()
  // WebAuthn Authentication work
  .get('/auth/generate-authentication-options', ({ cache, compute }) => {
    cache(NO_CACHE)
    compute(auth.getAuthenticationOptions)
  })
  .post('/auth/generate-authentication-options', ({ cache, compute }) => {
    cache(NO_CACHE)
    compute(auth.postAuthenticationOptions)
  })
  .post('/auth/verify-authentication', ({ compute }) => {
    compute(auth.postVerifyAuthentication)
  })

  // WebAuthn Registration work
  .post('/auth/generate-registration-options', ({ cache, compute }) => {
    cache(NO_CACHE)
  })
  .use(nuxtRoutes)
