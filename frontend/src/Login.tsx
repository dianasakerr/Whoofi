<<<<<<< HEAD
import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  CssBaseline,
  Alert,
  Box,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginFailed, setLoginFailed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
=======
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/login.css";

const Login = () => {
  const email = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState<string>("");
>>>>>>> 2a7eae9 (Login btn going to the searchdogwalker pag)
  const navigate = useNavigate();

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    console.log(loading);
    fetch(import.meta.env.VITE_API_URL + "sign_in/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: password,
        email: email,
      }),
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((response) => {
            localStorage.setItem("token", response.access_token);
            if (response.manager_type)
              localStorage.setItem("mngr", response.manager_type);
            window.dispatchEvent(new Event("storage"));
          });
          navigate("/search");
        } else {
          handleFailedLogin();
        }
      })
      .catch(handleFailedLogin)
      .finally(() => setLoading(false));
  };

<<<<<<< HEAD
  const handleFailedLogin = () => {
    setLoginFailed(true);
    setTimeout(() => setLoginFailed(false), 2500);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Log in
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {loginFailed && (
            <Alert severity="error">Email or password incorrect</Alert>
          )}
          <LoadingButton
            loading={loading}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, height: 40 }}
          >
            {!loading && "Log In"}
          </LoadingButton>
          <Button
            fullWidth
            variant="outlined"
            component={Link}
            to="/Signup"
            sx={{ mt: 1 }}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
=======
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
>>>>>>> 2a7eae9 (Login btn going to the searchdogwalker pag)
  );
};

export default Login;
