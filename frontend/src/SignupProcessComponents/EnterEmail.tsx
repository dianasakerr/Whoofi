import { useRef } from 'react'
import { Box, Button, TextField, Typography, Container } from '@mui/material';

interface Props {
    setEmail: (email: string) => void
    onBack: () => void;
}

const EnterEmail = ({setEmail,onBack}: Props) => {

    const emailRef = useRef<HTMLInputElement>(null)

    const handleNext = () => {
      if (emailRef.current?.value !== undefined) {
        setEmail(emailRef.current?.value);
        console.log(emailRef.current?.value);
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
            What's your email?
          </Typography>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Enter email"
            name="email"
            autoComplete="email"
            autoFocus
            inputRef={emailRef}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 2 }}>
            <Button
              variant="contained"
              onClick={onBack}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Container>
    );
}

export default EnterEmail