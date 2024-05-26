import { useRef, useState } from "react";
import { Box, Button, TextField, Typography, Container, Alert } from '@mui/material';

interface Props {
    setName: (name:string) => void
    onBack: () => void;
}

const SetName = ({setName,onBack}:Props) => {

  const nameRef = useRef<HTMLInputElement>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
    
  const handleNext = () => {
    if (nameRef.current?.value !== undefined && nameRef.current?.value !== "") {
      setName(nameRef.current?.value);
    }
    else {
      setShowAlert(true);
      console.log(showAlert)
      setTimeout(() => {setShowAlert(false);},3000);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" gutterBottom>
          Name
        </Typography>
        {showAlert && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            Name field can't be empty
          </Alert>
        )}
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="name"
          label="Enter your name"
          name="name"
          autoComplete="name"
          autoFocus
          inputRef={nameRef}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 2 }}>
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
}

export default SetName