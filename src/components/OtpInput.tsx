import React, { useEffect, useRef, useState } from 'react'
import { useAuthContext } from '../contexts/AuthContext'
import { useSessionStorage } from '../hooks/useSessionStorage'
import { authApi, AuthStatus } from '../services/authApi'
import '../styles/animations.css'

const OtpInput = () => {
  const { auth, setAuth } = useAuthContext()
  const { saveToken } = useSessionStorage()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [resendTimer, setResendTimer] = useState(60)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleOtpSubmit = async (otpValue: string) => {
    setAuth({
      isLoading: true,
      error: '',
      status: AuthStatus.LOADING_VALIDATE_OTP,
    })

    try {
      const response = await authApi.validateOtp(auth.phoneNumber, otpValue)
      saveToken(response, auth.phoneNumber)
      setAuth({
        isLoading: false,
        status: AuthStatus.AUTHENTICATED,
      })
    } catch (error: unknown) {
      setAuth({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Invalid OTP. Please try again.',
        status: AuthStatus.SENT_OTP,
      })
    }
  }

  const handleResendOtp = async () => {
    setAuth({
      isLoading: true,
      error: '',
      status: AuthStatus.REQUESTING_OTP,
    })

    try {
      await authApi.requestOtp(auth.phoneNumber)
      setAuth({
        isLoading: false,
        status: AuthStatus.SENT_OTP,
      })

      setResendTimer(60)
    } catch (error: unknown) {
      setAuth({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to resend OTP. Please try again.',
        status: AuthStatus.SENT_OTP,
      })
    }
  }

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    if (newOtp.every((digit) => digit !== '') && !auth.isLoading) {
      handleOtpSubmit(newOtp.join(''))
    }
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text')
    const digits = pastedData.replace(/\D/g, '').slice(0, 6)

    if (digits.length === 6) {
      const newOtp = digits.split('')
      setOtp(newOtp)
      inputRefs.current[5]?.focus()

      if (!auth.isLoading) {
        handleOtpSubmit(digits)
      }
    }
  }

  const handleResend = () => {
    if (resendTimer === 0) {
      handleResendOtp()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const otpString = otp.join('')
    if (otpString.length === 6) {
      handleOtpSubmit(otpString)
    }
  }

  const handleCancel = () => {
    setAuth({
      phoneNumber: '',
      isLoading: false,
      error: '',
      status: AuthStatus.VERIFY,
    })
  }

  return (
    <div className="w-full max-w-[400px] text-left justify-start items-start">
      <div className="mb-12">
        <h3 className="m-0 mb-2 text-2xl font-semibold text-gray-800">
          Enter verification code
        </h3>
        <p className="m-0 text-gray-600 text-sm leading-relaxed">
          We sent a 6-digit code to{' '}
          <span className="text-[#50d9cd] font-semibold tracking-wide">
            {auth.phoneNumber}
          </span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-4">
        <div
          className="flex justify-between mb-3 w-full max-w-[360px] px-2"
          onPaste={handlePaste}
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-[45px] h-[45px] border-2 border-gray-200 rounded-md text-center text-base font-semibold text-gray-800 transition-all bg-white focus:outline-none focus:border-[#50d9cd] focus:shadow-[0_0_0_3px_rgba(80,217,205,0.1)] focus:scale-105 disabled:bg-gray-50 disabled:cursor-not-allowed ${digit ? 'border-[#50d9cd] bg-green-50' : ''}`}
              disabled={auth.isLoading}
              autoComplete="one-time-code"
            />
          ))}
        </div>

        {auth.error && (
          <div className="text-red-500 text-xs mt-2">{auth.error}</div>
        )}

        <div className="w-full max-w-[360px] mb-2">
          <button
            type="submit"
            className="w-full h-9 bg-[#50d9cd] text-white border-none rounded text-sm font-semibold tracking-tight cursor-pointer transition-colors uppercase hover:bg-[#059669] hover:enabled:bg-[#059669] disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={
              auth.isLoading ||
              otp.some((digit) => digit === '') ||
              !!auth.error
            }
          >
            {auth.isLoading ? 'Verifying...' : 'Continue'}
          </button>
        </div>

        <div className="w-full max-w-[360px] mt-2">
          <button
            type="button"
            onClick={handleCancel}
            className="w-full h-9 bg-transparent text-gray-400 border border-gray-300 rounded text-sm font-semibold tracking-tight cursor-pointer transition-all uppercase hover:bg-gray-200 hover:border-gray-200 hover:text-white hover:enabled:bg-gray-200 hover:enabled:border-gray-200 hover:enabled:text-white disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={auth.isLoading}
          >
            Cancel
          </button>
        </div>
      </form>

      <div className="max-w-[360px] text-center pt-2 border-t border-gray-200">
        <p className="m-0 mb-2 text-gray-600 text-sm">
          Didn't receive the code?
        </p>
        <button
          type="button"
          onClick={handleResend}
          className={`bg-none border-none text-[#50d9cd] text-sm font-semibold cursor-pointer p-2 rounded transition-all hover:bg-green-50 hover:-translate-y-px ${resendTimer > 0 ? 'text-gray-400 cursor-not-allowed' : ''}`}
          disabled={resendTimer > 0 || auth.isLoading}
        >
          {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
        </button>
      </div>
    </div>
  )
}

export default OtpInput
