import { Link } from 'react-router-dom';
import "./styles/Header.css";
import Logo from './Logo';
import { useEffect, useState } from 'react';

const Header = () => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

  const checkLocalStorage = () => {
    const item = localStorage.getItem('token');
    setIsSignedIn(!!item);
  };

  useEffect(() => {
    checkLocalStorage();

    const handleStorageChange = () => {
      console.log('storage change heard from header');
      checkLocalStorage();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <header className="header">
      <Logo />
      <nav className="navbar">
        <ul className="nav-list">
          {isSignedIn ? 
            <li><Link to="/profile" className="nav-link">My Profile</Link></li> :
            <li><Link to="/login" className="nav-link">Sign in</Link></li>
          }
          <li><Link to="/signup" className="nav-link">SignUp</Link></li>
          <li><Link to="/" className="nav-link">Home Page</Link></li>
          <li><Link to="/search" className="nav-link">Look for a Dog Walker</Link></li>
          <li><a className="nav-link" onClick={() => {localStorage.removeItem('token'); window.dispatchEvent(new Event('storage'));}}>Exit</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
