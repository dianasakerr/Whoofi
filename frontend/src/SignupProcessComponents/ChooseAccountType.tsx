import { Box, Button, Typography, Container } from '@mui/material';

interface Props {
    setAccountType: (accountType: string) => void
}

const ChooseAccountType = ({setAccountType}: Props) => {
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
          Sign up as a
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            fullWidth
            sx={{ mb: 2 }}
            onClick={() => setAccountType("owner")}
          >
            Dog Owner
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => setAccountType("walker")}
          >
            Dog Walker
          </Button>
        </Box>
      </Box>
    </Container>
  );

}

export default ChooseAccountType