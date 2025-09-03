import loginBackground from "../../assets/loginBackground.jpg";
import Logo from "../../components/Logo";
import OtpInput from "../../components/OtpInput";
import PhoneInput from "../../components/PhoneInput";

import { useAuthContext } from "../../contexts/AuthContext";
import { AuthStatus } from "../../services/authApi";
import "./Login.css";

const Login = () => {
  const { auth } = useAuthContext();

  const renderAuthStep = () => {
    switch (auth.status) {
      case AuthStatus.VERIFY:
      case AuthStatus.REQUESTING_OTP:
      case AuthStatus.OTP_REQUEST_SUCCESS:
        return <PhoneInput />;
      case AuthStatus.SENT_OTP:
      case AuthStatus.LOADING_VALIDATE_OTP:
        return <OtpInput />;
      default:
        return (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h3>Verification Complete!</h3>
            <p>Redirecting you now...</p>
          </div>
        );
    }
  };

  return (
    <div className="login-wrapper">
      <div
        className="hero-image"
        style={{
          backgroundImage: `url(${loginBackground})`,
        }}
      />
      <div className="login-form-wrapper">
        <div className="login-form-content">
          <Logo />
          <h1>Log in to Set Up Your Dynamic QR Code</h1>
          <div className="auth-container">{renderAuthStep()}</div>
        </div>
      </div>
    </div>
  );
};

export default Login;
