import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
} from "@mui/material";

interface Props {
  setPassword: (password: string) => void;
  onBack: () => void;
}

const SetPassword = ({ setPassword, onBack }: Props) => {
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [innerPassword, setInnerPassword] = useState<string>("");
  const [repeatedPassword, setRepeatedPassword] = useState<string>("");

  const handleNext = () => {
    if (innerPassword.length < 8 || innerPassword !== repeatedPassword) {
      // show alert for 3 seconds
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } else {
      setPassword(innerPassword);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" gutterBottom>
          Choose a password
        </Typography>
        {showAlert && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {innerPassword.length < 8
              ? "Password must be longer than 8 characters"
              : "Repeated password must match the password"}
          </Alert>
        )}
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Enter password"
          type="password"
          id="passwordField"
          onChange={(e) => setInnerPassword(e.target.value)}
          autoFocus
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Repeat password"
          type="password"
          id="repeatedPasswordField"
          onChange={(e) => setRepeatedPassword(e.target.value)}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            mt: 2,
          }}
        >
          <Button variant="contained" onClick={onBack}>
            Back
          </Button>
          <Button variant="contained" color="primary" onClick={handleNext}>
            Next
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SetPassword;
