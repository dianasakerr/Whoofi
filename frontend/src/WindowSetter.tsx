import { useState } from 'react';
import Login from './Login'
import SignupProccess from './SignupProcess';

const WindowSetter = () => {

    const [currentWindow, setCurrentWindow] = useState<string>("Login");

    const onGoToSignup = () => {
        setCurrentWindow("Signup");
    }

    switch (currentWindow) {
        case "Login":
            return (<Login onGoToSignup={onGoToSignup}/>);
        case "Signup":
            return (<SignupProccess/>);
    }
}

export default WindowSetter