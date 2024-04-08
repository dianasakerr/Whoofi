import { useRef, useState } from "react";

interface Props {
    onGoToSignup: () => void
}

const Login = ({onGoToSignup} : Props) => {

  const username = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState<string>("");


  const handleSignup = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(username.current?.value);
    console.log(password);
  }

  return (
    <>
    <h1 className="title">Woofi</h1>
        <div className="card">
      <form onSubmit={handleSignup}>
        <label >Choose username
          <br/>
          <input 
            type='text' 
            id="usernameField" 
            placeholder='Enter username' 
            ref={username}>
          </input>
        </label>
        <br/>
        <label >Choose Password
        <br/>
        <input 
          type='password'
          id="passwordField"
          placeholder='Enter password' 
          onChange={(e) => setPassword(e.target.value)}>
        </input>
        </label>
        <br/>
        <input
          className='subButton'
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