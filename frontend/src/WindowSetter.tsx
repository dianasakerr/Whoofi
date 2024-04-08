import { useState } from 'react';
import Login from './Login'
import SignupProccess from './SignupProcess';
import SearchProvider from './searchProvider';

const WindowSetter = () => {

    const [currentWindow, setCurrentWindow] = useState<string>("Login");

    const onGoToSignup = () => {
        setCurrentWindow("Signup");
    }

    return (
        <>
        {currentWindow === 'Login' && <Login onGoToSignup={onGoToSignup}/>}
        {currentWindow === 'Signup' && <SignupProccess setCurrentWindow={setCurrentWindow}/>}
        {currentWindow === 'Scroller' && <SearchProvider/>}
        </>
    )

}

export default WindowSetter