import { useEffect, useRef, useState } from 'react'
import { countries, searchCountries, type Country } from '../data/countries'

interface CountryPickerProps {
  selectedCountry: Country
  onCountrySelect: (country: Country) => void
  disabled?: boolean
}

const CountryPicker = ({
  selectedCountry,
  onCountrySelect,
  disabled = false,
}: CountryPickerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredCountries, setFilteredCountries] =
    useState<Country[]>(countries)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      setTimeout(() => searchInputRef.current?.focus(), 50)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  useEffect(() => {
    const results = searchCountries(searchQuery)
    setFilteredCountries(results)
  }, [searchQuery])

  const handleCountrySelect = (country: Country) => {
    onCountrySelect(country)
    setIsOpen(false)
    setSearchQuery('')
  }

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
      if (!isOpen) {
        setSearchQuery('')
      }
    }
  }

  return (
    <div className="relative w-full h-full" ref={dropdownRef}>
      <button
        type="button"
        className={`flex justify-center items-center gap-2 w-full h-full px-2 border-0 border-b border-gray-300 bg-transparent text-sm font-medium cursor-pointer transition-all outline-none ${
          isOpen ? 'border-[#50d9cd]' : ''
        } ${
          disabled
            ? 'bg-gray-50 cursor-not-allowed opacity-60'
            : 'hover:border-[#50d9cd] focus:border-[#50d9cd]'
        }`}
        onClick={toggleDropdown}
        disabled={disabled}
      >
        <span className="text-base leading-none flex-shrink-0">
          {selectedCountry.flag}
        </span>
        <span className="font-medium text-gray-800 flex-1 text-left">
          {selectedCountry.dialCode}
        </span>
        <svg
          className={`flex-shrink-0 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg max-h-[400px] overflow-hidden mt-1 w-[320px]">
          <div className="p-3 border-b border-gray-200">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none transition-colors focus:border-[#50d9cd]"
            />
          </div>

          <ul className="max-h-[300px] overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <li
                  key={country.code}
                  className={`flex items-center p-2.5 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 ${
                    country.code === selectedCountry.code
                      ? 'bg-green-50 text-[#50d9cd]'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleCountrySelect(country)}
                >
                  <span className="text-xl flex-shrink-0">{country.flag}</span>
                  <span className="ml-2 flex items-center justify-between flex-1 min-w-0">
                    <span
                      className={`font-medium text-gray-800 flex-1 text-left overflow-hidden text-ellipsis whitespace-nowrap text-sm ${
                        country.code === selectedCountry.code
                          ? 'text-[#50d9cd]'
                          : ''
                      }`}
                    >
                      {country.name}
                    </span>
                    <span
                      className={`text-sm text-gray-600 font-medium flex-shrink-0 ml-2 ${
                        country.code === selectedCountry.code
                          ? 'text-[#50d9cd]'
                          : ''
                      }`}
                    >
                      {country.dialCode}
                    </span>
                  </span>
                </li>
              ))
            ) : (
              <li className="p-4 text-center text-gray-600 text-sm italic">
                No countries found matching "{searchQuery}"
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default CountryPicker
