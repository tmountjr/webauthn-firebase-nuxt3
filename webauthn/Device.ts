interface DeviceCommon {
  counter: number
  credentialIdSerialized: string
  credentialName?: string
  transports: string[]
}

/**
 * Describes an authentication device in its serialized form in Firebase
 */
export interface FirebaseDevice extends DeviceCommon {
  credentialID: number[]
  credentialPublicKey: number[]
}

/**
 * Describes an authentication device in its native form
 */
export interface Device extends DeviceCommon {
  credentialID: Uint8Array
  credentialPublicKey: Uint8Array
}

export interface AuthUser {
  email: string
  credentials?: Array<Device>
  profile: {
    favoriteColor: string
    name: string
  }
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