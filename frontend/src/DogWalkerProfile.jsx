import React, { useState, useEffect } from "react";
import "./styles/styles.css"; // Import your CSS styles
import woofiLogo from "./logosAndIcons/woofiLogo.jpeg";
import backArrow from "./logosAndIcons/back-arrow.svg";
import whatsappLogo from "./logosAndIcons/whatsapp logo.png";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Container,
  TextField,
} from "@mui/material";

// The DogWalkerProfile component
const DogWalkerProfile = ({ dogWalker, setCurrentDogWalker, updateDogWalker }) => {
  const [address, setAddress] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(dogWalker);

  useEffect(() => {
    if (dogWalker && dogWalker.coordinates) {
      reverseGeocode(...dogWalker.coordinates);
      console.log("Dog Walker in useEffect:", dogWalker); // Log dogWalker data
    }
  }, [dogWalker]);

  const resetDogWalker = () => setCurrentDogWalker(null);

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      console.log("Reverse Geocode Data:", data); // Log response data
      setAddress(data.address);
    } catch (error) {
      console.error("Reverse Geocode Error:", error); // Log errors
      setAddress("Address not found");
    }
  };

  const gotoWhatsApp = () => {
    const international = "+972" + dogWalker.phone_number.replace(/^0/, "");
    window.open("https://wa.me/" + international);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    updateDogWalker(editedProfile);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
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
          {isEditing ? (
            <>
              <TextField
                label="Username"
                name="username"
                value={editedProfile.username}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Experience (years)"
                name="years_of_experience"
                value={editedProfile.years_of_experience}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Hourly Rate"
                name="hourly_rate"
                value={editedProfile.hourly_rate}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Phone Number"
                name="phone_number"
                value={editedProfile.phone_number}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <Button onClick={handleSaveClick} variant="contained" sx={{ mt: 2 }}>
                Save
              </Button>
            </>
          ) : (
            <>
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
                <img src={whatsappLogo} width={40} height={40} alt="WhatsApp" />
              </IconButton>
              <Typography variant="body1" color="textSecondary">
                Rating: {dogWalker.rating}
              </Typography>
            </>
          )}
          <Button onClick={handleEditClick} variant="outlined" sx={{ mt: 2 }}>
            Edit Profile
          </Button>
        </CardContent>
        <IconButton onClick={resetDogWalker} sx={{ mt: 2 }}>
          <img src={backArrow} width={20} height={20} alt="Back" />
        </IconButton>
      </Card>
    </Container>
  );
};

// The parent component with fake data
const App = () => {
  const [currentDogWalker, setCurrentDogWalker] = useState({
    username: "JohnDoe",
    coordinates: [40.7128, -74.0060], // Example coordinates for New York City
    name: "John Doe",
    years_of_experience: 5,
    hourly_rate: 20,
    phone_number: "0123456789",
    rating: 4.5,
  });

  const updateDogWalker = (updatedProfile) => {
    setCurrentDogWalker(updatedProfile);
  };

  console.log("Current Dog Walker Data:", currentDogWalker);

  return (
    <div className="App">
      <DogWalkerProfile
        dogWalker={currentDogWalker}
        setCurrentDogWalker={setCurrentDogWalker}
        updateDogWalker={updateDogWalker}
      />
    </div>
  );
};

export default App;
