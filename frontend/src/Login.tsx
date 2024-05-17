import { useRef, useState } from "react";
import "./styles/login.css";
import { Link } from "react-router-dom";

interface Props {
  onGoToSignup: () => void;
  onSuccessfulLogin: () => void;
}

const Login = ({ onGoToSignup, onSuccessfulLogin }: Props) => {
  const email = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState<string>("");

  const handleSignup = (event: React.FormEvent) => {
    event.preventDefault();

    // replace console logs with requests to the server
    console.log(email.current?.value);
    console.log(password);

    // change according to server request
    onSuccessfulLogin();
  };

  return (
    <div className="background-container">
      <div className="background-image-container">
        <div className="login-container">
          <div className="login-center">
            <h2>Log in</h2>
            <form onSubmit={handleSignup}>
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
              onClick={onGoToSignup}
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
