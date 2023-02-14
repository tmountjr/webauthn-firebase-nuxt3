import { Device } from './Device'
import Request from '@edgio/core/router/Request'
import Response from '@edgio/core/router/Response'
import { expectedOrigin, rpID, rpName } from './options'
import {
  generateRegistrationOptions,
  GenerateRegistrationOptionsOpts,
  VerifiedRegistrationResponse,
  verifyRegistrationResponse
} from '@simplewebauthn/server/./dist'
import { isoBase64URL, isoUint8Array } from '@simplewebauthn/server/helpers'

interface generateBody {
  user: {
    uid: string,
    email: string
  },
  devices: Array<Device>
}

interface verifyBody {
  credential: any,
  devices?: Array<Device>
  expectedChallenge: string
}

interface verifyReturn {
  verified: boolean
  newDevice?: Device
}

export async function postRegistrationOptions(req: Request, res: Response) {
  if (!req.body) return

  const body: generateBody = JSON.parse(req.body)
  const { user, devices } = body
  const opts: GenerateRegistrationOptionsOpts = {
    rpName,
    rpID,
    userID: user.uid,
    userName: user.email,
    timeout: 60000,
    attestationType: 'none',
    excludeCredentials: devices.map(dev => ({
      id: dev.credentialID,
      type: 'public-key',
      transports: dev.transports
    })),
    authenticatorSelection: {
      userVerification: 'preferred',
      residentKey: 'required',
    },
    supportedAlgorithmIDs: [-7, -257],
  }

  res.setHeader('content-type', 'application/json')
  try {
    const options = generateRegistrationOptions(opts)
    res.statusCode = 200
    res.body = JSON.stringify(options)
  } catch (e: any) {
    res.statusCode = 400
    res.body = JSON.stringify({ error: e.message })
  }
}

export async function postVerifyRegistration(req: Request, res: Response) {
  if (!req.body) return

  res.setHeader('content-type', 'application/json')

  const body: verifyBody = JSON.parse(req.body)
  const { devices, credential, expectedChallenge } = body
  
  let verification: VerifiedRegistrationResponse
  try {
    const opts = {
      response: credential,
      expectedChallenge,
      expectedOrigin,
      expectedRPID: rpID,
      requireUserVerification: true
    }
    verification = await verifyRegistrationResponse(opts)
  } catch (e: any) {
    res.statusCode = 400
    res.body = JSON.stringify({ error: e.message })
    return
  }

  const { verified, registrationInfo } = verification
  let returnValue: verifyReturn = { verified }
  if (verified && registrationInfo) {
    const { credentialPublicKey, credentialID, counter } = registrationInfo
    const existingDevice = devices?.find(device => isoUint8Array.areEqual(device.credentialID, credentialID))
    if (!existingDevice) {
      const credentialIdSerialized = isoBase64URL.fromBuffer(registrationInfo.credentialID)
      const newDevice: Device = {
        credentialPublicKey,
        credentialID,
        counter,
        credentialIdSerialized,
        transports: credential.response.transports
      }
      returnValue.newDevice = newDevice
    }
  }

  res.body = JSON.stringify(returnValue)
}
