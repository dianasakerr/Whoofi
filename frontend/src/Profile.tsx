import React, { useState, useEffect } from "react";
import { Container, Typography, Box, TextField, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    city: "",
    phone_number: "",
    password: "",
    date_of_birth: "",
    years_of_experience: 0,
    hourly_rate: 0,
    longitude: 0,
    latitude: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found");
          setLoading(false);
          return;
        }
        const response = await axios.get(`${import.meta.env.VITE_API_URL}get_user`, {
          params: { token },
        });
        setUserData(response.data);
        await reverseGeocode(response.data.latitude, response.data.longitude);
      } catch (error) {
        setError("Error fetching user data");
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      setAddress(`${data.address.road}, ${data.address.city}, ${data.address.country}`);
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("Address not found");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found");
        return;
      }
      await axios.put(`${import.meta.env.VITE_API_URL}/user/profile/update`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Optionally handle success message or further actions
    } catch (error) {
      setError("Error updating user profile");
      console.error("Error updating user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          User Profile
        </Typography>
        <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Username"
            name="username"
            value={userData.username}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="City"
            name="city"
            value={address}
            onChange={handleChange}
            fullWidth
            disabled
          />
          <TextField
            label="Phone Number"
            name="phone_number"
            value={userData.phone_number}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Date of Birth"
            name="date_of_birth"
            value={userData.date_of_birth}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Years of Experience"
            name="years_of_experience"
            value={userData.years_of_experience}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Hourly Rate"
            name="hourly_rate"
            value={userData.hourly_rate}
            onChange={handleChange}
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;
