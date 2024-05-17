import React from 'react';
import "./styles/Header.css"
import Logo from './Logo';

const Header = () => {
    const goToProfile = () => {
        // Replace '#' with the URL of your profile page
        window.location.href = '#';
    };

    const goToSignUp = () => {
        // Replace '#' with the URL of your sign-up page
        window.location.href = 'Login.tsx';
    };

    const goToHomePage = () => {
        // Replace '#' with the URL of your home page
        window.location.href = '#';
    };

    const goToDogWalkersSearchPage = () => {
        // Replace '#' with the URL of your dog walkers search page
        window.location.href = '#';
    };

    const handleExit = () => {
        // Handle exit action here, such as logging out
    };

    return (
        <header className="header">
            <Logo/>
            <nav className="navbar">
                <ul className="nav-list">
                    <li><a href="#" className="nav-link" onClick={goToProfile}>My Profile</a></li>
                    <li><a href="#" className="nav-link" onClick={goToSignUp}>Sign Up</a></li>
                    <li><a href="#" className="nav-link" onClick={goToHomePage}>Home Page</a></li>
                    <li><a href="#" className="nav-link" onClick={goToDogWalkersSearchPage}>Look for a Dog Walker</a></li>
                    <li><a href="#" className="nav-link" onClick={handleExit}>Exit</a></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
