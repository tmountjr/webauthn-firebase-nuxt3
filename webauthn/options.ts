const { RP_ID } = process.env
const rpID: string = RP_ID || 'localhost'
const expectedOrigin = rpID === 'localhost'
  ? 'http://localhost:3000'
  : `https://${rpID}`
const rpName = 'Webauthn / Firebase / Nuxt Demo'

export {
  rpID,
  expectedOrigin,
  rpName
}