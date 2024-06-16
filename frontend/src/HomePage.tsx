import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './styles/HomePage.css'; // Import CSS file for styling

const HomePage = () => {
  return (
    <Container maxWidth="md" className="home-page-container">
      <Box className="content-box">
        <Typography variant="h3" component="h1" className="heading">
          Welcome to Whoofi!
        </Typography>
        <Typography variant="body1" className="description">
          Welcome to Whoofi, where wagging tails and happy walks meet! This platform is designed to connect passionate dog walkers with loving dog owners. Whether you're a dedicated pet parent seeking reliable care for your furry friend or an enthusiastic dog lover eager to embark on joyful adventures with canine companions, you've come to the right place. We will help you find the perfect match, ensuring that every walk is not just a stroll but an experience filled with care, trust, and tail-wagging delight.
        </Typography>
        <Button component={Link} to="/signup" variant="contained" color="primary" className="action-button">
          Join Us Today
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;
