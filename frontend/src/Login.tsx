import { useState } from "react";
import { TextField, Button , Typography, Container, CssBaseline, Alert, Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


const Login = () => {

  const [email,setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginFailed, setLoginFailed] = useState<boolean>(false);
  const [loading,setLoading] = useState<boolean>(false)
  const navigate = useNavigate();

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    console.log(loading)
    fetch(import.meta.env.VITE_API_URL + 'sign_in/',{
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: password,
        email: email
      })
  }).then(res => {
    if (res.ok) {
      res.json().then((response) => localStorage.setItem('userType',response));
      localStorage.setItem("token", email ); // work on recieving token from server
      window.dispatchEvent(new Event('storage'));
      navigate('/search');
    }
    else {
      handleFailedLogin();
    }

  }).catch(handleFailedLogin).finally(() => setLoading(false));
  }

  const handleFailedLogin = () => {
    setLoginFailed(true);
    setTimeout(() => setLoginFailed(false), 2500);
  }

  return (
    <Container component="main" maxWidth="xs">
    <CssBaseline />
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
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
        {loginFailed && <Alert severity="error">Email or password incorrect</Alert>}
        <LoadingButton
          loading={loading}
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 , height: 40}}
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
);
}

export default Login
