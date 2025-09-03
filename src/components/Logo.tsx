import logoImg from '../assets/logo.png'

const Logo = () => {
  return (
    <div className="h-auto w-[143px] bg-white my-4 mr-7 float-left">
      <img src={logoImg} alt="StaffAny Logo" className="block w-full h-auto" />
    </div>
  )
}

export default Logo
