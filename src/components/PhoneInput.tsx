import React, { useState } from 'react'
import { useAuthContext } from '../contexts/AuthContext'
import { AuthStatuses } from '../contexts/types'
import { type Country, findCountryByDialCode } from '../data/countries'
import { authApi } from '../services/authApi'
import '../styles/animations.css'
import CountryPicker from './CountryPicker'
import {
  formatPhoneNumber,
  formatPhoneNumberDisplay,
  isValidPhoneNumber,
} from './validation'

const PhoneInput = () => {
  const { auth, setAuth } = useAuthContext()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    findCountryByDialCode('+65') || {
      code: 'SG',
      dialCode: '+65',
      name: 'Singapore',
      flag: '🇸🇬',
    },
  )

  const handlePhoneSubmit = async (phoneNumber: string) => {
    setAuth({
      isLoading: true,
      error: '',
      status: AuthStatuses.REQUESTING_OTP,
    })

    try {
      await authApi.requestOtp(phoneNumber)
      setTimeout(() => {
        setAuth({
          phoneNumber: phoneNumber,
          isLoading: false,
          status: AuthStatuses.SENT_OTP,
        })
      }, 1500)
    } catch (error: unknown) {
      setAuth({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to send OTP. Please try again.',
        status: AuthStatuses.VERIFY,
      })
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumberDisplay(e.target.value)
    setPhoneNumber(formatted)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fullNumber = formatPhoneNumber(phoneNumber, selectedCountry.dialCode)
    if (!isValidPhoneNumber(phoneNumber)) {
      return
    }
    handlePhoneSubmit(fullNumber)
  }

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="w-full max-w-[360px] h-[50px] flex gap-3 items-end">
        <div className="flex-shrink-0 w-[100px] h-[45px] z-10">
          <CountryPicker
            selectedCountry={selectedCountry}
            onCountrySelect={handleCountrySelect}
            disabled={auth.isLoading}
          />
        </div>

        <div className="relative flex-1 h-[45px]">
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            className="phone-input-animated"
            disabled={auth.isLoading}
            required
            maxLength={20}
          />
          <label className={`floating-label ${phoneNumber ? 'active' : ''}`}>
            Phone number
          </label>
        </div>
      </div>

      {auth.error && (
        <div className="text-red-500 text-xs mt-2">{auth.error}</div>
      )}

      <button
        type="submit"
        className="btn-primary mt-4"
        disabled={
          auth.isLoading ||
          !phoneNumber.trim() ||
          !isValidPhoneNumber(phoneNumber)
        }
      >
        {auth.isLoading ? 'Sending...' : 'VERIFY'}
      </button>

      <div className="max-w-[360px] mt-4">
        <p className="text-xs text-gray-600 leading-relaxed m-0">
          By tapping Verify, you are indicating that you accept our{' '}
          <a
            href="https://www.staffany.com/terms-of-services"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#50d9cd] no-underline hover:underline"
          >
            Terms of Service
          </a>{' '}
          and{' '}
          <a
            href="https://www.staffany.com/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#50d9cd] no-underline hover:underline"
          >
            Privacy Policy
          </a>
          . An SMS may be sent. Message & data rates may apply.
        </p>
      </div>
    </form>
  )
}

export default PhoneInput
