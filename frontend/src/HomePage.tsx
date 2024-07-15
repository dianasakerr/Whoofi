import { Link } from "react-router-dom";
import { Container, Typography, Box, Button } from "@mui/material";
import "./styles/Homepage.css";

const HomePage = () => {
  return (
    <Container maxWidth="lg" className="home-page-container">
      <Box
        className="hero-section"
        sx={{
          backgroundImage: 'url(/mnt/data/image.png)', // Use the path of the uploaded image
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff",
          padding: "50px 20px 0px 20px", // Reduced padding to move content higher
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start", // Align content at the top
          height: "100vh", // Take up full viewport height
          textAlign: "center",
          position: "fixed", // Fix the position
          width: "100%", // Ensure full width
          top: 0, // Align to top of the viewport
          left: 0, // Align to left of the viewport
        }}
      >
        <Typography variant="h3" component="h1" className="heading" sx={{ mt: 4, mb: 2, color: "#FF6347" }}>
          Welcome to Whoofi
        </Typography>
        <Typography className="welcome-text" sx={{ backgroundColor: "rgba(255, 255, 255, 0.9)", padding: "10px",
         borderRadius: "5px", maxWidth: "650px", color: "#000" }}>
          Welcome to Whoofi, where wagging tails and happy walks meet! This platform is designed to connect passionate
           dog walkers with loving dog owners. Whether you're a dedicated pet parent seeking reliable care for your
            furry friend or an enthusiastic dog lover eager to embark on joyful adventures with canine companions,
             you've come to the right place.
        </Typography>
        <Button
          component={Link}
          to="/signup"
          variant="contained"
          className="action-button"
          sx={{ mt: 3, backgroundColor: '#11a772', ':hover': { backgroundColor: '#11a772' },
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)' }} >
          Join Us Today
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;
