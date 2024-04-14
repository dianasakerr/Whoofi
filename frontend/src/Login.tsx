import { useRef, useState } from "react";

interface Props {
    onGoToSignup: () => void
    setCurrentWindow: (window: string) => void
}

const Login = ({onGoToSignup,setCurrentWindow} : Props) => {

  const email = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState<string>("");


  const handleSignup = (event: React.FormEvent) => {
    event.preventDefault();

    // replace console logs with requests to the server
    console.log(email.current?.value);
    console.log(password);

    // change according to server request
    setCurrentWindow("Scroller");
  }

  return (
    <>
    <h1 className="title">Woofi</h1>
        <div>
      <form onSubmit={handleSignup}>
        <label >Email: 
          <input 
            type='text' 
            id="usernameField" 
            placeholder='Enter email' 
            ref={email}>
          </input>
        </label>
        <br/>
        <label >Password: 
        <input 
          type='password'
          id="passwordField"
          placeholder='Enter password' 
          onChange={(e) => setPassword(e.target.value)}>
        </input>
        </label>
        <br/>
        <input
          type="submit" 
          onSubmit={handleSignup} 
          value="Log in">
        </input>
      </form>
      <button onClick={onGoToSignup}>Sign up</button>
    </div>
    </>
  )
}

export default Login