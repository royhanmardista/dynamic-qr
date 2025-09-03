export const AuthStatus = {
  LOADING_VALIDATE_OTP: 'LOADING_VALIDATE_OTP',
  REQUESTING_OTP: 'REQUESTING_OTP',
  OTP_REQUEST_SUCCESS: 'OTP_REQUEST_SUCCESS',
  SENT_OTP: 'SENT_OTP',
  VERIFY: 'VERIFY',
} as const

export const AuthError = {
  ERROR_INCORRECT_OTP: 'ERROR_INCORRECT_OTP',
  ERROR_INVALID_PHONE_NUMBER: 'ERROR_INVALID_PHONE_NUMBER',
  ERROR_TOO_MANY_ATTEMPTS: 'ERROR_TOO_MANY_ATTEMPTS',
} as const

export type AuthStatusTypes = keyof typeof AuthStatus
export type AuthErrorTypes = keyof typeof AuthError
