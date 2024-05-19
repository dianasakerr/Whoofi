import "./styles/Logo.css"
import { Link } from 'react-router-dom';
import React from 'react';
import logo from "../public/logosAndIcons/dogPaw.svg";

const Logo = () => {
  return (
    <div className="logo-container">
    <Link to="/"> {/*change to the right link*/}
      <img src={logo} alt="Logo" className="logo-img" />
    </Link>
    </div>
  );
}

export default Logo;


