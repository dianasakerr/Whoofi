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
  Rating,
  CircularProgress,
} from "@mui/material";

const DogWalkerProfile = ({ dogWalker, setCurrentDogWalker }) => {
  const [address, setAddress] = useState("");
  const [profilePicture, setProfilePicture] = useState(woofiLogo);
  const [loadingPicture, setLoadingPicture] = useState(true);

  const resetDogWalker = () => setCurrentDogWalker(null);

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lng}&lon=${lat}` // I know... its janky but it is what it is. need to deliver
      );
      response.json().then((data) => {
        console.log(data.address);
        setAddress(data.address);
      });
    } catch (error) {
      setAddress("Address not found");
    }
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const getProfilePic = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}get_profile_picture/?file_id=${id}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const buffer = await response.arrayBuffer();
      const base64Image = arrayBufferToBase64(buffer);
      const imageUrl = `data:image/jpeg;base64,${base64Image}`;

      setProfilePicture(imageUrl);
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    } finally {
      setLoadingPicture(false);
    }
  };

  useEffect(() => {
    reverseGeocode(...dogWalker.coordinates);
    if (dogWalker.profile_picture_id) {
      getProfilePic(dogWalker.profile_picture_id);
    } else {
      setLoadingPicture(false);
    }
  }, [dogWalker]);

  const gotoWhatsApp = () => {
    const internetional = "+972" + dogWalker.phone_number.replace(/^0/, "");
    window.open("https://wa.me/" + internetional);
  };

  const handleRate = (event, value) => {
    console.log(dogWalker, value);
    fetch(
      import.meta.env.VITE_API_URL +
        "add_rating/?" +
        new URLSearchParams({
          token: localStorage.getItem("token"),
          walker_email: dogWalker.email,
          rate: value,
        }),
      { method: "PUT" }
    );
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
        {loadingPicture ? (
          <CircularProgress />
        ) : (
          <CardMedia
            component="img"
            height="300"
            image={profilePicture}
            alt={dogWalker.name}
            sx={{ width: "300px", borderRadius: "50%" }}
          />
        )}
        <CardContent>
          <Typography variant="h4" component="div" gutterBottom>
            {dogWalker.username}
          </Typography>
          {address && (
            <Typography variant="body1" color="textSecondary">
              Location: {address.city || address.town}, {address.road}{" "}
              {address.house_number}
            </Typography>
          )}
          <Typography variant="body1" color="textSecondary">
            Experience: {dogWalker.years_of_experience} years
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Price: {dogWalker.hourly_rate}₪ per hour
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
            Rate dog walker
          </Typography>
          <Rating defaultValue={2.5} precision={0.25} onChange={handleRate} />
        </CardContent>
        <IconButton onClick={resetDogWalker} sx={{ mt: 2 }}>
          <img src={backArrow} width={20} height={20} />
        </IconButton>
      </Card>
    </Container>
  );
};

export default DogWalkerProfile;
