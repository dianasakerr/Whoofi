import { useRef } from 'react'

interface Props {
    setEmail: (email: string) => void
}

const EnterEmail = ({setEmail}: Props) => {

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
    <button onClick={handleNext}>next</button>
    </>
  )
}

export default EnterEmail