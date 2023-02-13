import { generateAuthenticationOptions, verifyAuthenticationResponse } from '@simplewebauthn/server'
import { isoBase64URL, isoUint8Array } from '@simplewebauthn/server/helpers'
import Request from '@edgio/core/router/Request'
import Response from '@edgio/core/router/Response'

const { RP_ID } = process.env
const rpID: string = RP_ID || 'localhost'
const expectedOrigin = rpID === 'localhost'
  ? 'http://localhost:3000'
  : `https://${rpID}`
const rpName = 'Webauthn / Firebase / Nuxt Demo'

type credOpts = {
  timeout: number
  allowCredentials?: []
  userVerification: string
  rpID: string
}

export function getAuthenticationOptions(_req: Request, res: Response): void {
  const opts: credOpts = {
    timeout: 60000,
    allowCredentials: [],
    userVerification: 'required',
    rpID,
  }

  res.setHeader('content-type', 'application/json')
  try {
    const options = generateAuthenticationOptions(opts)
    res.statusCode = 200
    res.body = JSON.stringify(options)
  } catch (e: any) {
    res.statusCode = 400
    res.body = JSON.stringify({ error: e.message })
  }
}

export async function postAuthenticationOptions(req: Request, res: Response): Promise<void> {
  if (!req.body) {
    return
  }

  // The device list has potentially been posted (ie. testing a single auth
  // device).
  const jsonBody = JSON.parse(req.body)
  let { devices } = jsonBody
  const { fbUid } = jsonBody
  if (devices) {
    devices = convertFirebaseDevices(devices)
  } else {
    devices = await userDevices(fbUid)
  }

  const opts: credOpts = {
    timeout: 60000,
    userVerification: 'required',
    rpID,
  }
  opts.allowCredentials = devices.map(device => ({
    id: device.credentialID,
    type: 'public-key',
    transports: device.transports
  }))

  res.setHeader('content-type', 'application/json')
  try {
    const options = generateAuthenticationOptions(opts)
    res.statusCode = 200
    res.body = JSON.stringify(options)
  } catch (e) {
    res.statusCode = 400
    res.body = JSON.stringify({ error: e.message })
  }
}