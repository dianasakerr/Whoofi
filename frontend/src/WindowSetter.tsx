import { Route,Routes } from "react-router-dom"
import { useState } from 'react';
import HomePage from './HomePage'; // Import the home page component
import Login from './Login';
import SignupProcess from './SignupProcess';
import DogWalkersSearchPage from './DogWalkersSearchPage';
import Header from './Header';
import OpeningPage from './OpeningPage';

const WindowSetter = () => {
    // return <Routes>
    //     <Route path="/" element={{HomePage}}>
    //     <Route path="/Login" element={{Login}}>
    //     <Route path="/SignupProcess" element={{SignupProcess}}>
    //     <Route path="/DogWalkersSearchPage" element={{DogWalkersSearchPage}}>
    // </Routes>



    const [currentWindow, setCurrentWindow] = useState<string>('Login');

    const onGoToSignup = () => {
        setCurrentWindow('Signup');
    }

    const onSuccessfulLogin = () => {
        setCurrentWindow('Scroller');
    }

    const onSuccessfulSignup = () => {
        setCurrentWindow('Scroller');
    }

    const handleBackBtn = () => {
        setCurrentWindow('Login');
    };

    return (
        <>
            <Header />
            <div className="background-container">
                <div className="background-image-container">
                    {/*{currentWindow === 'Home' && <HomePage />}*/}
                    {currentWindow === 'Login' && <Login onGoToSignup={onGoToSignup} onSuccessfulLogin={onSuccessfulLogin} />}
                    {currentWindow === 'Signup' && <SignupProcess onSuccessfulSignup={onSuccessfulSignup} />}
                    {currentWindow === 'Scroller' && <DogWalkersSearchPage />}
                </div>
            </div>
            <>
                <button onClick={handleBackBtn}>Back to Log In</button>
            </>
        </>
    );
}

export default WindowSetter;
