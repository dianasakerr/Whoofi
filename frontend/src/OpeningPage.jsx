import React, { useEffect } from 'react';
import "./styles/OpeningPage.css"

const onSuccessfulOpening = () => {
    setCurrentWindow('Login'); // Transition to the login page
};

const OpeningPage = ({ onSuccessfulOpening }) => {
    // Use useEffect to automatically transition after a certain duration
    useEffect(() => {
        const timer = setTimeout(() => {
            onSuccessfulOpening(); // Call the callback function to transition
        }, 4000); // 2 seconds duration

        return () => clearTimeout(timer); // Cleanup on unmount
    }, [onSuccessfulOpening]);

    return (
        <div className="opening-page">
            <h1>Hey! Welcome to Whoofi!</h1>
        </div>
    );
}

export default OpeningPage;
