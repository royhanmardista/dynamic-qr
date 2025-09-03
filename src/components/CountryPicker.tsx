import React, { useEffect, useRef, useState } from 'react'
import { countries, searchCountries, type Country } from '../data/countries'
import './CountryPicker.css'

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
  const [highlightedIndex, setHighlightedIndex] = useState(0)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

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
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 50)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    const results = searchCountries(searchQuery)
    setFilteredCountries(results)
    setHighlightedIndex(0)
  }, [searchQuery])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setIsOpen(true)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev < filteredCountries.length - 1 ? prev + 1 : prev,
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev))
        break
      case 'Enter':
        e.preventDefault()
        if (filteredCountries[highlightedIndex]) {
          handleCountrySelect(filteredCountries[highlightedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSearchQuery('')
        break
    }
  }

  useEffect(() => {
    if (isOpen && listRef.current) {
      const highlightedElement = listRef.current.children[
        highlightedIndex
      ] as HTMLElement
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        })
      }
    }
  }, [highlightedIndex, isOpen])

  const handleCountrySelect = (country: Country) => {
    onCountrySelect(country)
    setIsOpen(false)
    setSearchQuery('')
    setHighlightedIndex(0)
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
    <div className="country-picker" ref={dropdownRef}>
      <button
        type="button"
        className={`country-picker-trigger ${isOpen ? 'open' : ''} ${
          disabled ? 'disabled' : ''
        }`}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Selected country: ${selectedCountry.name}`}
      >
        <span className="country-flag">{selectedCountry.flag}</span>
        <span className="country-code">{selectedCountry.dialCode}</span>
        <svg
          className={`dropdown-arrow ${isOpen ? 'rotated' : ''}`}
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
        <div className="country-picker-dropdown">
          <div className="country-search">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="country-search-input"
            />
          </div>

          <ul
            ref={listRef}
            className="country-list"
            role="listbox"
            aria-label="Country list"
          >
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country, index) => (
                <li
                  key={country.code}
                  className={`country-option ${
                    index === highlightedIndex ? 'highlighted' : ''
                  } ${country.code === selectedCountry.code ? 'selected' : ''}`}
                  onClick={() => handleCountrySelect(country)}
                  role="option"
                  aria-selected={country.code === selectedCountry.code}
                >
                  <span className="country-flag">{country.flag}</span>
                  <span className="country-info">
                    <span className="country-name">{country.name}</span>
                    <span className="country-dial-code">
                      {country.dialCode}
                    </span>
                  </span>
                </li>
              ))
            ) : (
              <li className="no-results">
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
