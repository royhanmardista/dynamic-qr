import React, { useState } from 'react'
import { useAuthContext } from '../contexts/AuthContext'
import { type Country, findCountryByDialCode } from '../data/countries'
import { authApi, AuthStatus } from '../services/authApi'
import CountryPicker from './CountryPicker'
import './PhoneInput.css'
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
    <form onSubmit={handleSubmit} className="phone-input-form">
      <div className="phone-input-container">
        <div className="country-selector">
          <CountryPicker
            selectedCountry={selectedCountry}
            onCountrySelect={handleCountrySelect}
            disabled={auth.isLoading}
          />
        </div>

        <div className="phone-number-input">
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            className="phone-input"
            disabled={auth.isLoading}
            required
            maxLength={20}
          />
          <label className={`floating-label ${phoneNumber ? 'active' : ''}`}>
            Phone number
          </label>
        </div>
      </div>

      {auth.error && <div className="error-message">{auth.error}</div>}

      <button
        type="submit"
        className="verify-button"
        disabled={
          auth.isLoading ||
          !phoneNumber.trim() ||
          !isValidPhoneNumber(phoneNumber)
        }
      >
        {auth.isLoading ? 'Sending...' : 'VERIFY'}
      </button>

      <div className="terms-text">
        <p>
          By tapping Verify, you are indicating that you accept our{' '}
          <a
            href="https://www.staffany.com/terms-of-services"
            target="_blank"
            rel="noopener noreferrer"
            className="terms-link"
          >
            Terms of Service
          </a>{' '}
          and{' '}
          <a
            href="https://www.staffany.com/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="terms-link"
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
