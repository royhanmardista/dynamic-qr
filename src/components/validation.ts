export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  const digits = phoneNumber.replace(/\D/g, '')

  return digits.length >= 8 && digits.length <= 15
}

export const formatPhoneNumber = (
  phoneNumber: string,
  countryCode: string,
): string => {
  const digits = phoneNumber.replace(/\D/g, '')

  return `${countryCode}${digits}`
}

export const formatPhoneNumberDisplay = (value: string): string => {
  const digits = value.replace(/\D/g, '')

  if (digits.length <= 4) return digits
  if (digits.length <= 8) return `${digits.slice(0, 4)} ${digits.slice(4)}`
  return `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8, 12)}`
}
