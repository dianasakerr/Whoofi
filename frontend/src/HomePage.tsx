import { Container, Typography, Box } from "@mui/material";
import "./styles/HomePage.css";

const HomePage = () => {
  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Whoofi!
        </Typography>
        <Typography className="welcome-text" sx={{ mx: "auto" }}>
          Welcome to Whoofi, where wagging tails and happy walks meet! this
          platform is designed to connect passionate dog walkers with loving dog
          owners. Whether you're a dedicated pet parent seeking reliable care
          for your furry friend or an enthusiastic dog lover eager to embark on
          joyful adventures with canine companions, you've come to the right
          place. We will help you to find perfect match, ensuring that every
          walk is not just a stroll but an experience filled with care, trust,
          and tail-wagging delight. Join us today and let's make tails wag
          together!
        </Typography>
      </Box>
    </Container>
  );
};

export default HomePage;
