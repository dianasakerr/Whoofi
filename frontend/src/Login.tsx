import { useRef, useState } from "react";
import "./styles/login.css"
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


const Login = () => {

  const email = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState<string>("");
  const [loginFailed, setLoginFailed] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    console.log({email: email,password:password});
    fetch(import.meta.env.VITE_API_URL + 'sign_in',{
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: password,
        email: email.current?.value
      })
  }).then(res => {
    if (res.ok) {
      localStorage.setItem('token', "placeholder_token"); // work on recieving token from server
      navigate('/search');
    }
    else {
      handleFailedLogin();
    }

  }).catch(handleFailedLogin)
  }

  const handleFailedLogin = () => {
    setLoginFailed(true);
    setTimeout(() => setLoginFailed(false), 2500);
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
        {loginFailed && <p>email or password incorrect</p>}
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
