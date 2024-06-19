import React, { useState, useEffect } from "react";
import { Container, Typography, Box, TextField, Button, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import woofiLogo from "./logosAndIcons/woofiLogo.jpeg";
import AddDog from "./AddDog";

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
    profilePicture: null,
  });

  const [initialUserData, setInitialUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [token, setToken] = useState("");
  const [addingDog, setAddingDog] = useState(false);
  const [vaccinationData, setVaccinationData] = useState([]);
  const [openVaccinationModal, setOpenVaccinationModal] = useState(false);
  const [dogs, setDogs] = useState([]);


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
          setError("No token found");
          setLoading(false);
          return;
        }
        setToken(storedToken);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}get_user/?token=${storedToken}`);
        setUserData(response.data);
        // const responseDogs = await axios.get(`${import.meta.env.VITE_API_URL}get_dogs_by_user/?token=${storedToken}`);
        // setDogs(responseDogs.data.dogs);

        setInitialUserData(response.data);
        await reverseGeocode(response.data.coordinates[1], response.data.coordinates[0]);
        // await fetchVaccinationData(storedToken, responseDogs.data.dogs.dog_name);
      } catch (error) {
        setError("Error fetching user data");
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }



  // }
    };


    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (!userData.profilePicture) {
      setProfilePicture(woofiLogo);
    } else {
      setProfilePicture(userData.profilePicture);
    }
  }, [userData.profilePicture]);

  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const data = await response.json();
      const address = data.address;
      setAddress(`${address.road ? address.road : ''}, ${address.city ? address.city : ''}, ${address.country ? address.country : ''}`);
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("Address not found");
    }
  };
  const handleAddDog = async (dogData) => {
  try {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setError("No token found");
      return;
    }

    const response = await axios.post(`${import.meta.env.VITE_API_URL}/create_dog/?token=${storedToken}`, dogData);

    if (response.status === 200) {
      // Fetch updated user data after adding a dog
      const updatedResponse = await axios.get(`${import.meta.env.VITE_API_URL}get_user/?token=${storedToken}`);
      setUserData(updatedResponse.data);
    }
  } catch (error) {
    console.error("Error adding dog:", error);
    setError("Error adding dog");
  }
};

// Pass the function to AddDog
<AddDog close={() => { setAddingDog(false) }} addDog={handleAddDog} />

  const fetchVaccinationData = async (token, dogName) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}` + '/get_vaccination_table/?token=' + token + '&dog_name=' + dogName, {
        method: "GET"
      });
      if (response.data) {
        setVaccinationData(response.data);
      }
    } catch (error) {
      console.error("Error fetching vaccination data:", error);
    }
  };



  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profilePicture") {
      setProfilePicture(files[0]);
    }

    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (!token) {
        setError("No token found");
        return;
      }

      const formData = new FormData();
      let url = `${import.meta.env.VITE_API_URL}edit_user/?token=${token}`;

      for (const [key, value] of Object.entries(userData)) {
        url += "&" + key + '=' + value
      }

      console.log(url);

      const response = fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": undefined,
        },
        body: formData
      });

      console.log("Save successful:", response.data);
      setEditMode(false);
    } catch (error) {
      setError("Error updating user profile");
      console.error("Error updating user profile:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setUserData(initialUserData);
    setEditMode(false);
  };

  const handleOpenVaccinationModal = () => {
    setOpenVaccinationModal(true);
  };

  const handleCloseVaccinationModal = () => {
    setOpenVaccinationModal(false);
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
          {userData.username}
        </Typography>
        {!editMode ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 4,
              p: 2,
              backgroundColor: "white",
              borderRadius: "10px"
            }}
          >
            <img
              src={profilePicture}
              alt="Profile"
              style={{ width: "200px", height: "200px", objectFit: "cover", borderRadius: "50%" }}
            />
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography variant="h5" component="h3" gutterBottom>
                    Email:
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body1">{userData.email}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="h5" component="h3" gutterBottom>
                    City:
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body1">{address}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="h5" component="h3" gutterBottom>
                    Phone Number:
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body1">{userData.phone_number}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="h5" component="h3" gutterBottom>
                    Date of Birth:
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body1">{userData.date_of_birth}</Typography>
                </TableCell>
              </TableRow>
              {userData.user_type === 'walker' && <>
                <TableRow>
                  <TableCell>
                    <Typography variant="h5" component="h3" gutterBottom>
                      Years of Experience:
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1">{userData.years_of_experience}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="h5" component="h3" gutterBottom>
                      Hourly Rate:
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1">{userData.hourly_rate}</Typography>
                  </TableCell>
                </TableRow>
              </>}
            </TableBody>
            <Button
              variant="contained"
              color="primary"
              onClick={toggleEditMode}
              sx={{ mt: 2 }}
            >
              Edit
            </Button>
            {dogs.map((dog, index) => (
  <Box key={index} sx={{ backgroundColor: "white", mt: 4, p: 2, borderRadius: "10px" }}>
    <Typography variant="h4">{dog.name}</Typography>
    <Typography variant="body1">Breed: {dog.breed}</Typography>
    <Typography variant="body1">Age: {dog.age}</Typography>
    {/* Add other dog information as needed */}
  </Box>
))}

          </Box>

        ) : (
          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              type="file"
              name="profilePicture"
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Username"
              name="username"
              value={userData.username}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Phone Number"
              name="phone_number"
              value={userData.phone_number}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Years of Experience"
              name="years_of_experience"
              type="number"
              value={userData.years_of_experience}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Hourly Rate"
              name="hourly_rate"
              type="number"
              value={userData.hourly_rate}
              onChange={handleChange}
              fullWidth
            />
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
            <Button variant="outlined" color="primary" onClick={handleCancel}>
              Cancel
            </Button>

          </Box>
        )}

        {/* Vaccination Table */}

        <Box sx={{ backgroundColor: "white", mt: 4, p: 2, borderRadius: "10px" }}>
          {userData.dogs.length === 0 && <Typography variant="h4">Add your dogs to see their vaccinations here</Typography>}
          <Button variant="contained" onClick={() => setAddingDog(!addingDog)}>Add Dog</Button>
          <br></br>
          {addingDog && <AddDog close={() => { setAddingDog(false) }} />}
          {userData.dogs.length !== 0 &&
            <>
              <Button variant="contained" onClick={handleOpenVaccinationModal} sx={{ mt: 2 }}>
                View Vaccination Table
              </Button>
            </>
          }
        </Box>

        {/* Vaccination Modal */}
        <Dialog open={openVaccinationModal} onClose={handleCloseVaccinationModal} maxWidth="md" fullWidth>
          <DialogTitle>Vaccination Table</DialogTitle>
          <DialogContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Vaccine Name</TableCell>
                    <TableCell>Next Due Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vaccinationData.map((vaccine, index) => (
                    <TableRow key={index}>
                      <TableCell>{vaccine.vaccine_name}</TableCell>
                      <TableCell>{vaccine.date}</TableCell>
                      <TableCell>{vaccine.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseVaccinationModal} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Profile;
