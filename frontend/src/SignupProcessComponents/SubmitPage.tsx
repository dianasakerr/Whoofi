import { Box, Button, Typography } from '@mui/material';

interface Props {
    name: string
    email: string
    onSubmit: () => void
    setEmail: (email: string) => void
    setName: (name: string) => void
    onBack: () => void;
}

const SubmitPage = ({name, email, onSubmit,setEmail,setName,onBack}: Props) =>  {
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
      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button variant="contained" color="primary" onClick={onSubmit}>
          Sign Up
        </Button>
        <Button variant="outlined" color="secondary" onClick={onBack}>
          Back
        </Button>
      </Box>
    </Box>
  );

}

export default SubmitPage