import logoImg from '../assets/logo.png'
import './Logo.css'

const Logo = () => {
  return (
    <div className="logo-wrapper">
      <img src={logoImg} alt="StaffAny Logo" className="logo-image" />
    </div>
  )
}

export default Logo
