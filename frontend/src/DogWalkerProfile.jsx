import React, { useState, useEffect } from "react";
import "./styles/styles.css"; // Import your CSS styles
import woofiLogo from "./logosAndIcons/woofiLogo.jpeg";
import backArrow from "./logosAndIcons/back-arrow.svg";
import whatsappLogo from "./logosAndIcons/whatsapp logo.png";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Container,
} from "@mui/material";

const DogWalkerProfile = ({ dogWalker, setCurrentDogWalker }) => {
  const [address, setAddress] = useState("");

  const resetDogWalker = () => setCurrentDogWalker(null);

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      response.json().then((data) => {
        setAddress(data.address);
      });
    } catch (error) {
      setAddress("Address not found");
    }
  };

  useEffect(() => {
    reverseGeocode(...dogWalker.coordinates);
    console.log(dogWalker);
  }, []);

  const gotoWhatsApp = () => {
    const internetional = "+972" + dogWalker.phone_number.replace(/^0/, "");
    window.open("https://wa.me/" + internetional);
  };

  return (
    <Container>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4,
        }}
      >
        <CardMedia
          component="img"
          height="300"
          image={woofiLogo}
          alt={dogWalker.name}
          sx={{ width: "300px", borderRadius: "50%" }}
        />
        <CardContent>
          <Typography variant="h4" component="div" gutterBottom>
            {dogWalker.username}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Location: {address.city || address.town}, {address.road}{" "}
            {address.house_number}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Experience: {dogWalker.years_of_experience} years
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Price: ${dogWalker.hourly_rate} per hour
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <Typography variant="body1" color="textSecondary" sx={{ mr: 1 }}>
              Phone: {dogWalker.phone_number}
            </Typography>
          </Box>
          <IconButton color="primary" onClick={gotoWhatsApp}>
            <img src={whatsappLogo} width={40} height={40} />
          </IconButton>
          <Typography variant="body1" color="textSecondary">
            Rating: {dogWalker.rating}
          </Typography>
        </CardContent>
        <IconButton onClick={resetDogWalker} sx={{ mt: 2 }}>
          <img src={backArrow} width={20} height={20} />
        </IconButton>
      </Card>
    </Container>
  );
};

export default DogWalkerProfile;
