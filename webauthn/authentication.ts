import { isoBase64URL, isoUint8Array } from '@simplewebauthn/server/helpers';
import { FirebaseDevice, Device } from './Device'
import Request from '@edgio/core/router/Request'
import Response from '@edgio/core/router/Response'
import { convertFirebaseDevices, userDevices, authToken } from './firebase-admin'
import { generateAuthenticationOptions, VerifiedAuthenticationResponse, verifyAuthenticationResponse } from '@simplewebauthn/server'
import { rpID, expectedOrigin } from './options'

interface credOpts {
  timeout: number
  allowCredentials?: Array<{
    id: Uint8Array,
    type: string,
    transports: string[]
  }>
  userVerification: string
  rpID: string
}

interface verifyBody {
  devices?: Array<FirebaseDevice>
  fbUid: string
  currentChallenge: string
  body: any
  withToken: boolean
}

interface verifyReturn {
  verified: boolean
  authenticator?: Device
  token?: string
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
  const { devices, fbUid } = jsonBody
  let convertedDevices: Device[]
  if (devices) {
    convertedDevices = convertFirebaseDevices(devices)
  } else {
    convertedDevices = await userDevices(fbUid)
  }

  const opts: credOpts = {
    timeout: 60000,
    userVerification: 'required',
    rpID,
  }
  opts.allowCredentials = convertedDevices.map(device => ({
    id: device.credentialID,
    type: 'public-key',
    transports: device.transports
  }))

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

export async function postVerifyAuthentication(req: Request, res: Response): Promise<void> {
  if (!req.body) return
  
  res.setHeader('content-type', 'application/json')

  const jsonBody: verifyBody = JSON.parse(req.body)
  const { devices, fbUid, currentChallenge, body, withToken = false } = jsonBody
  let convertedDevices: Device[]
  if (devices) {
    convertedDevices = convertFirebaseDevices(devices)
  } else {
    convertedDevices = await userDevices(fbUid)
  }

  const expectedChallenge = currentChallenge
  let dbAuthenticator: Device | undefined
  const bodyCredIdBuffer = isoBase64URL.toBuffer(body.rawId)
  for (const dev of convertedDevices) {
    if (isoUint8Array.areEqual(dev.credentialID, bodyCredIdBuffer)) {
      dbAuthenticator = dev
      break
    }
  }

  if (!dbAuthenticator) {
    res.statusCode = 400
    res.body = JSON.stringify({ error: 'Authenticator is not registered with this site.' })
    return
  }

  let verification: VerifiedAuthenticationResponse
  try {
    const opts = {
      response: body,
      expectedChallenge,
      expectedOrigin,
      expectedRPID: rpID,
      authenticator: dbAuthenticator,
      requireUserVerification: true
    }
    verification = await verifyAuthenticationResponse(opts)
  } catch (e: any) {
    res.statusCode = 400
    res.body = JSON.stringify({ error: e.message })
    return
  }

  const { verified, authenticationInfo } = verification
  const returnValue: verifyReturn = { verified }
  if (verified) {
    dbAuthenticator.counter = authenticationInfo.newCounter
    returnValue.authenticator = dbAuthenticator

    if (withToken) {
      returnValue.token = await authToken(fbUid)
    }
  }
  res.body = JSON.stringify(returnValue)
}
