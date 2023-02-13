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