import { useRef, useState } from "react";
import "./styles/login.css"
import { Link } from "react-router-dom";



const Login = () => {

  const email = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState<string>("");


  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    console.log({email: email,password:password});
    // Add login request to the server

    // change according to server request
  }

  return (
      <div className="login-container">
        <div className="login-center"> 
        <h2> Log in</h2>
      <form onSubmit={handleLogin}>
          <input 
            className="login-input"
            type='text' 
            id="usernameField" 
            placeholder='Email' 
            ref={email}>
          </input>
        <br/>
        <input 
          className="login-input"
          type='password'
          id="passwordField"
          placeholder='Password' 
          onChange={(e) => setPassword(e.target.value)}>
        </input>
        <br/>
        <input
          className="login-btn"
          type="submit" 
          onSubmit={handleLogin} 
          value="Log in">
        </input>
      </form>
      <Link to="/Signup" className="login-btn">
        Sign up
      </Link>
      </div>
    </div>
  )
}

export default Login