import { LoadingButton } from '@mui/lab';
import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';

interface Props {
    name: string
    email: string
    onSubmit: () => Promise<boolean | void>
    setEmail: (email: string) => void
    setName: (name: string) => void
    onBack: () => void;
}

const SubmitPage = ({name, email, onSubmit,setEmail,setName,onBack}: Props) =>  {
  const [loading, setLoading] = useState<boolean>(false);
  const [error,setError] = useState<string>("");

  const handleSubmit = async () => {
    setLoading(true);
    onSubmit()?.then(res => {
      if (res) {
        setLoading(false);
      }
      else if (res === false) {
        setError("This email already has an account. sign in instead");
      }
      else {
        setError("A server error has accured. please check your internet connection and try again");
      }
      setLoading(false);

    })
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
      <Typography variant="h5" component="h3" gutterBottom>
        Name: {name}
        <Button variant="outlined" color="primary" size="small" onClick={() => setName('')} sx={{ ml: 2 }}>
          Change
        </Button>
      </Typography>
      <Typography variant="h5" component="h3" gutterBottom>
        Email: {email}
        <Button variant="outlined" color="primary" size="small" onClick={() => setEmail('')} sx={{ ml: 2 }}>
          Change
        </Button>
      </Typography>
      {error && <p>{error}</p>}
      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <LoadingButton
          loading={loading}
          onClick={handleSubmit}
          fullWidth
          variant="contained"
        >
          {!loading && "Sign up"}
        </LoadingButton>
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
      </Box>
    </Box>
  );

}

export default SubmitPage