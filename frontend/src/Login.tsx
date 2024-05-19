import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/login.css";

const Login = () => {
  const email = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();

    // Replace console logs with requests to the server
    console.log(email.current?.value);
    console.log(password);

    // After successful login, navigate to the home page or any other page
    navigate("/search");
  };

  return (
    <div className="background-container">
      <div className="background-image-container">
        <div className="login-container">
          <div className="login-center">
            <h2>Log in</h2>
            <form onSubmit={handleLogin}>
              <input
                className="login-input"
                type="text"
                id="usernameField"
                placeholder="Email"
                ref={email}
              />
              <br />
              <input
                className="login-input"
                type="password"
                id="passwordField"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <br />
              <input
                className="login-btn"
                type="submit"
                value="Log in"
              />
            </form>
            <button
              className="login-btn"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
