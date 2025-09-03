import loginBackground from '../../assets/loginBackground.jpg'
import Logo from '../../components/Logo'
import OtpInput from '../../components/OtpInput'
import PhoneInput from '../../components/PhoneInput'

import { useAuthContext } from '../../contexts/AuthContext'
import { AuthStatuses } from '../../contexts/types'
import '../../styles/animations.css'

const Login = () => {
  const { auth } = useAuthContext()

  const renderAuthStep = () => {
    switch (auth.status) {
      case AuthStatuses.VERIFY:
      case AuthStatuses.REQUESTING_OTP:
      case AuthStatuses.OTP_REQUEST_SUCCESS:
        return <PhoneInput />
      case AuthStatuses.SENT_OTP:
      case AuthStatuses.LOADING_VALIDATE_OTP:
        return <OtpInput />
      default:
        return (
          <div className="text-center px-4 py-8">
            <div className="success-icon">✓</div>
            <h3 className="m-0 mb-2 text-gray-800 text-xl font-semibold">
              Verification Complete!
            </h3>
            <p className="m-0 text-gray-600 text-sm">Redirecting you now...</p>
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen w-full">
      <div
        className="hidden md:block w-1/2 h-screen flex-shrink-0 bg-center bg-no-repeat bg-cover"
        style={{
          backgroundImage: `url(${loginBackground})`,
        }}
      />
      <div className="flex items-center p-8 md:p-12 lg:p-24 w-full md:w-1/2 bg-gray-50 flex-shrink-0">
        <div className="flex flex-col w-full max-w-[400px]">
          <Logo />
          <h1 className="my-6 md:my-8 text-3xl md:text-4xl font-normal text-gray-800 max-w-[400px] text-center md:text-left">
            Log in to Set Up Your Dynamic QR Code
          </h1>
          <div className="w-full">{renderAuthStep()}</div>
        </div>
      </div>
    </div>
  )
}

export default Login
