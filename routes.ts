import { Router } from '@edgio/core'
import { nuxtRoutes } from '@edgio/nuxt-nitro'
import { getAuthenticationOptions, postAuthenticationOptions } from './webauthn/authentication'

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
  .get('/auth/generate-authentication-options', ({ cache, compute }) => {
    cache(NO_CACHE)
    compute(getAuthenticationOptions)
  })
  .post('/auth/generate-authentication-options', ({ cache, compute }) => {
    cache(NO_CACHE)
    compute(postAuthenticationOptions)
  })
  .use(nuxtRoutes)
