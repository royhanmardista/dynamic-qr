import axios, { type AxiosInstance } from 'axios'
import config from '../env'

export interface OtpValidationResponse {
  token: string
  user?: unknown
}

export interface AuthError {
  code: string
  message: string
}

export const AuthStatus = {
  VERIFY: 'VERIFY',
  REQUESTING_OTP: 'REQUESTING_OTP',
  OTP_REQUEST_SUCCESS: 'OTP_REQUEST_SUCCESS',
  SENT_OTP: 'SENT_OTP',
  LOADING_VALIDATE_OTP: 'LOADING_VALIDATE_OTP',
  AUTHENTICATED: 'AUTHENTICATED',
} as const

export type AuthStatusType = keyof typeof AuthStatus

export const AuthErrorType = {
  ERROR_INVALID_PHONE_NUMBER: 'ERROR_INVALID_PHONE_NUMBER',
  ERROR_TOO_MANY_ATTEMPTS: 'ERROR_TOO_MANY_ATTEMPTS',
  ERROR_INCORRECT_OTP: 'ERROR_INCORRECT_OTP',
  ERROR_OTP_EXPIRED: 'ERROR_OTP_EXPIRED',
  ERROR_NETWORK: 'ERROR_NETWORK',
} as const

export type AuthErrorType = keyof typeof AuthErrorType

interface AxiosError {
  response: {
    data: {
      message?: string
    }
  }
}

const isAxiosError = (error: unknown): error is AxiosError => {
  return typeof error === 'object' && error !== null && 'response' in error
}

export class AuthApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: config.apiUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  async requestOtp(phoneNumber: string): Promise<void> {
    try {
      await this.api.post('/otp/request/dynamic-qr', {
        phoneNumber,
      })
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message)
        }
      }
      throw new Error('Failed to send OTP. Please try again.')
    }
  }

  async validateOtp(phoneNumber: string, otp: string): Promise<string> {
    try {
      const response = await this.api.post<string>('/otp/verify', {
        phoneNumber,
        otp,
      })

      return response.data
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message)
        }
      }
      throw new Error('Invalid OTP. Please try again.')
    }
  }
}

export const authApi = new AuthApiService()
