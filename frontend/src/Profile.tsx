import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { styled } from "@mui/system";

const ProfileContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const ProfilePage = () => {
  const [userType, setUserType] = useState("dogOwner"); // 'dogOwner' or 'dogWalker'
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    rate: "",
    sizesAccepted: {
      small: false,
      mid: false,
      big: false,
    },
  });

  useEffect(() => {
    // Fetch user data and set it to profileData
    // Example: setProfileData(fetchedData);
  }, []);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setProfileData((prevData) => ({
        ...prevData,
        sizesAccepted: {
          ...prevData.sizesAccepted,
          [name]: checked,
        },
      }));
    } else {
      setProfileData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSave = () => {
    // Save profile data
    console.log("Profile data saved:", profileData);
  };

  return (
    <ProfileContainer maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Edit{" "}
        {userType === "dogOwner" ? "Dog Owner Profile" : "Dog Walker Profile"}
      </Typography>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Name"
          name="name"
          value={profileData.name}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Email"
          name="email"
          value={profileData.email}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Phone"
          name="phone"
          value={profileData.phone}
          onChange={handleChange}
          fullWidth
        />
        {userType === "dogWalker" && (
          <>
            <TextField
              label="Experience (years)"
              name="experience"
              value={profileData.experience}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Rate per hour ($)"
              name="rate"
              value={profileData.rate}
              onChange={handleChange}
              fullWidth
            />
            <Typography variant="h6" component="h2">
              Sizes Accepted
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={profileData.sizesAccepted.small}
                  onChange={handleChange}
                  name="small"
                />
              }
              label="Small"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={profileData.sizesAccepted.mid}
                  onChange={handleChange}
                  name="mid"
                />
              }
              label="Mid"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={profileData.sizesAccepted.big}
                  onChange={handleChange}
                  name="big"
                />
              }
              label="Big"
            />
          </>
        )}
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </Box>
    </ProfileContainer>
  );
};

export default ProfilePage;
