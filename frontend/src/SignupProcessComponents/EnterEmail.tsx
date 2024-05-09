import { useRef, useState } from 'react'
import { Redirect } from 'react-router-dom';
import BackButton from './BackButton';
import { useHistory } from 'react-router-dom';

interface Props {
    setEmail: (email: string | undefined) => void
    onBack: () => void;
}

const EnterEmail = ({setEmail,onBack}: Props) => {

    const emailRef = useRef<HTMLInputElement>(null)
    // const history = useHistory();

    const handleNext = () => {
      if (emailRef.current?.value !== undefined) {
        setEmail(emailRef.current?.value);
        console.log(emailRef.current?.value);
      }
    }

    return (
    <>
    <label>what's your email?
        <input type='text' placeholder='Enter email' ref={emailRef}></input>
    </label>
    <button onClick={handleNext}>Next</button>
    <button onClick={onBack}>Back</button>
    </>
  )
}

export default EnterEmail