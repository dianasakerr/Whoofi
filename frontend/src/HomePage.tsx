import { Container, Typography, Box } from '@mui/material';

const HomePage = () => {
  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to the Home Page!
        </Typography>
      </Box>
    </Container>
  );
};

export default HomePage;
