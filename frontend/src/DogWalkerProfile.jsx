import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/styles.css"; // Import your CSS styles
import woofiLogo from "./logosAndIcons/woofiLogo.jpeg";
import backArrow from "./logosAndIcons/back-arrow.svg";
import {
  Rating,
} from "@mui/material";

const DogWalkerProfile = ({ dogWalker, setCurrentDogWalker }) => {
  const { userId } = useParams(); // Get the user ID from the URL
  const navigate = useNavigate();
  const [dogWalker, setDogWalker] = useState(null);
  const [address, setAddress] = useState("");

  const resetDogWalker = () => setCurrentDogWalker(null);
  useEffect(() => {
    // Fetch user data based on the userId
    const fetchDogWalker = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}get_user/${userId}`
        );
        setDogWalker(response.data);
        reverseGeocode(response.data.coordinates.lat, response.data.coordinates.lng);
      } catch (error) {
        console.error("Error fetching dog walker data:", error);
      }
    };

    fetchDogWalker();
  }, [userId]);

  const reverseGeocode = async (lat, lng) => {
    try {
@@ -35,13 +54,11 @@ const DogWalkerProfile = ({ dogWalker, setCurrentDogWalker }) => {
    }
  };

  useEffect(() => {
    reverseGeocode(...dogWalker.coordinates);
  }, []);
  const resetDogWalker = () => navigate("/");

  const gotoWhatsApp = () => {
    const internetional = "+972" + dogWalker.phone_number.replace(/^0/, "");
    window.open("https://wa.me/" + internetional);
    const international = "+972" + dogWalker.phone_number.replace(/^0/, "");
    window.open("https://wa.me/" + international);
  };

  const handleRate = (event, value) => {
@@ -58,6 +75,10 @@ const DogWalkerProfile = ({ dogWalker, setCurrentDogWalker }) => {
    );
  };

  if (!dogWalker) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Card
@@ -79,10 +100,12 @@ const DogWalkerProfile = ({ dogWalker, setCurrentDogWalker }) => {
          <Typography variant="h4" component="div" gutterBottom>
            {dogWalker.username}
          </Typography>
          {address && <Typography variant="body1" color="textSecondary">
            Location: {address.city || address.town}, {address.road}{" "}
            {address.house_number}
          </Typography>}
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