import React, { useEffect, useRef, useState } from 'react'
import { useAuthContext } from '../contexts/AuthContext'
import { useSessionStorage } from '../hooks/useSessionStorage'
import { authApi, AuthStatus } from '../services/authApi'
import './OtpInput.css'

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

      setAuth({
        isLoading: false,
        status: AuthStatus.AUTHENTICATED,
      })

      saveToken(response, auth.phoneNumber)
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
    <div className="otp-container">
      <div className="otp-header">
        <h3>Enter verification code</h3>
        <p>
          We sent a 6-digit code to{' '}
          <span className="phone-highlight">{auth.phoneNumber}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="otp-form">
        <div className="otp-inputs" onPaste={handlePaste}>
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
              className="otp-input"
              disabled={auth.isLoading}
              autoComplete="one-time-code"
            />
          ))}
        </div>

        {auth.error && <div className="error-message">{auth.error}</div>}

        <div className="otp-buttons">
          <button
            type="submit"
            className="continue-button"
            disabled={
              auth.isLoading ||
              otp.some((digit) => digit === '') ||
              !!auth.error
            }
          >
            {auth.isLoading ? 'Verifying...' : 'Continue'}
          </button>
        </div>

        <div className="cancel-button-container">
          <button
            type="button"
            onClick={handleCancel}
            className="cancel-button"
            disabled={auth.isLoading}
          >
            Cancel
          </button>
        </div>
      </form>

      <div className="resend-section">
        <p>Didn't receive the code?</p>
        <button
          type="button"
          onClick={handleResend}
          className={`resend-button ${resendTimer > 0 ? 'disabled' : ''}`}
          disabled={resendTimer > 0 || auth.isLoading}
        >
          {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
        </button>
      </div>
    </div>
  )
}

export default OtpInput
