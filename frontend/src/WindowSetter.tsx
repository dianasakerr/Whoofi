import { useState } from 'react';
import Login from './Login'
import SignupProccess from './SignupProcess';
import DogWalkersSearchPage from './DogWalkersSearchPage'
import Header from './Header';

const WindowSetter = () => {
    const [backgroundClass,setBackgroundClass] = useState<string>('background-image-container');
    const [currentWindow, setCurrentWindow] = useState<string>("Login");

    const onGoToSignup = () => {
        setCurrentWindow("Signup");
        setBackgroundClass(backgroundClass + ' animate');
    }

    const onSuccessfulLogin = () => {
        setCurrentWindow("Scroller");
        setBackgroundClass(backgroundClass + ' animate');
    }

    const onSuccessfulSignup = () => {
        setCurrentWindow('Scroller');
    }
    
    return (
        <>
        <Header/>
        <div className="background-container">
        <div className={backgroundClass}>
        {currentWindow === 'Login' && <Login onGoToSignup={onGoToSignup} onSuccessfulLogin={onSuccessfulLogin}/>}
        </div>
        {currentWindow === 'Signup' && <SignupProccess onSuccessfulSignup={onSuccessfulSignup}/>}
        {currentWindow === 'Scroller' && <DogWalkersSearchPage/>}
        </div>
        </>
    )

}

export default WindowSetter