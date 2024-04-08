import { useState } from 'react';
import Login from './Login'
import SignupProccess from './SignupProcess';

const WindowSetter = () => {

    const [currentWindow, setCurrentWindow] = useState<string>("Login");

    const onGoToSignup = () => {
        setCurrentWindow("Signup");
    }

    return (
        <>
        {currentWindow === 'Login' && <Login onGoToSignup={onGoToSignup}/>}
        {currentWindow === 'Signup' && <SignupProccess/>}
        </>
    )

}

export default WindowSetter