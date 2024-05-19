import { useRef } from 'react'

interface Props {
    setEmail: (email: string) => void
    onBack: () => void;
}

const EnterEmail = ({setEmail,onBack}: Props) => {

    const emailRef = useRef<HTMLInputElement>(null)

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