import React, { useState } from 'react'
import { useAuthContext } from '../contexts/AuthContext'
import { type Country, findCountryByDialCode } from '../data/countries'
import { authApi, AuthStatus } from '../services/authApi'
import CountryPicker from './CountryPicker'
import '../styles/animations.css'
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
      status: AuthStatus.REQUESTING_OTP,
    })

    try {
      await authApi.requestOtp(phoneNumber)
      setTimeout(() => {
        setAuth({
          phoneNumber: phoneNumber,
          isLoading: false,
          status: AuthStatus.SENT_OTP,
        })
      }, 1500)
    } catch (error: unknown) {
      setAuth({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to send OTP. Please try again.',
        status: AuthStatus.VERIFY,
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
            className="w-full h-full p-0 border-0 border-b border-gray-300 animated-underline text-base font-medium outline-none disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={auth.isLoading}
            required
            maxLength={20}
          />
          <label className={`absolute left-0.5 ${phoneNumber ? 'bottom-[30px] text-xs text-[#50d9cd] opacity-100' : 'bottom-2 text-gray-400 text-sm'} pointer-events-none transition-all duration-200 ease-in-out peer-focus:left-0.5 peer-focus:bottom-[30px] peer-focus:text-xs peer-focus:text-[#50d9cd] peer-focus:opacity-100`}>
            Phone number
          </label>
        </div>
      </div>

      {auth.error && <div className="text-red-500 text-xs mt-2">{auth.error}</div>}

      <button
        type="submit"
        className="mt-4 h-9 w-full max-w-[360px] bg-[#50d9cd] text-white border-none rounded text-sm font-semibold tracking-tight cursor-pointer transition-colors uppercase hover:bg-[#059669] hover:enabled:bg-[#059669] disabled:opacity-60 disabled:cursor-not-allowed"
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
