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
  setPhoneNumber: (phoneNumber: string) => void;
  onBack: () => void;
}

const SetPhoneNumber = ({ setPhoneNumber, onBack }: Props) => {
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumberState] = useState<string>("");

  const handleNext = () => {
    if (!/^\d+$/.test(phoneNumber)) {
      // show alert for 3 seconds
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } else {
      setPhoneNumber(phoneNumber);
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
          Enter your phone number
        </Typography>
        {showAlert && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            Phone number must be numeric
          </Alert>
        )}
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Enter phone number"
          type="tel"
          id="phoneNumberField"
          onChange={(e) => setPhoneNumberState(e.target.value)}
          autoFocus
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

export default SetPhoneNumber;
