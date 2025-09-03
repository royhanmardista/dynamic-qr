import React from "react";
import logoImg from "../assets/logo.png";
import "./Logo.css";

const Logo: React.FC = () => {
  return (
    <div className="logo-wrapper">
      <img src={logoImg} alt="StaffAny Logo" className="logo-image" />
    </div>
  );
};

export default Logo;
