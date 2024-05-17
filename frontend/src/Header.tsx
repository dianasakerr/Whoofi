import React from 'react';
import { Link } from 'react-router-dom';
import "./styles/Header.css";
import Logo from './Logo';

const Header = () => {
  return (
    <header className="header">
      <Logo />
      <nav className="navbar">
        <ul className="nav-list">
          <li><Link to="/profile" className="nav-link">My Profile</Link></li>
          <li><Link to="/signup" className="nav-link">SignUp</Link></li>
          <li><Link to="/" className="nav-link">Home Page</Link></li>
          <li><Link to="/search" className="nav-link">Look for a Dog Walker</Link></li>
          <li><a href="#" className="nav-link" onClick={() => { /* Handle Exit */ }}>Exit</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
