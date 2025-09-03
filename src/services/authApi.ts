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
    if (!config?.apiUrl) {
      throw new Error('AuthApiService: Missing config.apiUrl')
    }
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
