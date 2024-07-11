import React, {useState, useEffect} from "react";
import {
    Container,
    Typography,
    Box,
    TextField,
    Button,
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
} from "@mui/material";
import axios from "axios";
import {useNavigate} from "react-router-dom";
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
  const [addingDog, setAddingDog] = useState(false);
  const [loadedVaccines, setLoadedVaccines] = useState(-1);
  const [vaccinationData, setVaccinationData] = useState();
  const [showVacTable, setShowVacTable] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Fetch user profile data
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
          setError("No token found");
          setLoading(false);
          return;
        }
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}get_user/?token=${storedToken}`
        );
        setUserData(response.data);
        setInitialUserData(response.data);
        await reverseGeocode(
          response.data.coordinates[1],
          response.data.coordinates[0]

        );

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        // Fetch vaccination data
        if (response.data.dogs) {
          const vacs = [];
          for (const dogName of response.data.dogs) {
            const vac_for_dog = await fetchVaccinationData(
              storedToken,
              dogName
            );
            vacs.push({ vacs: vac_for_dog, name: dogName });
          }
          setVaccinationData(vacs);
          setLoadedVaccines(response.data.dogs.length);
          setShowVacTable(new Array(response.data.dogs.length).fill(false));
        }
      } catch (error) {
        setError("Error fetching user data");
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }

    };

    const fetchDogInfo = async (token, email) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}` +
                "get_dogs_by_user/?token=" +
                token +
                "&owner_email=" +
                email,
                {
                    method: "GET",
                }
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching dog info:", error);
        }
    };

    const fetchVaccinationData = async (token, dogName) => {
        try {

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}` +
                "get_vaccination_table/?token=" +
                token +
                "&dog_name=" +
                dogName,
                {
                    method: "GET",
                }
            );
            const data = await response.json();
            if (data) {
                return data;
            }
        } catch (error) {
            console.error("Error fetching vaccination data:", error);
        }
    };

    const handleChange = (e) => {
        const {name, value, files} = e.target;

        if (name === "profilePicture") {
            setNewProfilePic(files[0]);
        }

        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const setNewProfilePic = async (file) => {
        const formData = new FormData();
        formData.append("file", file, file.name);
        console.log(formData);
        const response = await fetch(
            import.meta.env.VITE_API_URL +
            "upload_profile_picture/?token=" +
            localStorage.getItem("token"),
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            }
        );

    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const setNewProfilePic = async (file) => {
    const formData = new FormData();
    formData.append("file", file, file.name);
    console.log(formData);
    const response = await fetch(
      import.meta.env.VITE_API_URL +
        "upload_profile_picture/?token=" +
        localStorage.getItem("token"),
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      }
    );

    const data = await response.json();
    localStorage.setItem("token", data.token);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (!localStorage.getItem("token")) {
        setError("No token found");
        return;
      }

      let url = `${
        import.meta.env.VITE_API_URL
      }edit_user/?token=${localStorage.getItem("token")}`;

      for (const [key, value] of Object.entries(userData)) {
        url += "&" + key + "=" + value;
      }

      console.log(url);
      const formData = new FormData();
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": undefined,
        },
        body: formData,
      });
      const data = await response.json();

      localStorage.setItem("token", data.token);
      window.dispatchEvent(new Event("storage"));
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
              borderRadius: "10px",
            }}
          >
            <img
              src={profilePicture}
              alt="Profile"
              style={{
                width: "200px",
                height: "200px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
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
                  <Typography variant="body1">
                    {userData.phone_number}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="h5" component="h3" gutterBottom>
                    Date of Birth:
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body1">
                    {userData.date_of_birth}
                  </Typography>
                </TableCell>
              </TableRow>
              {userData.user_type === "walker" && (
                <>
                  <TableRow>
                    <TableCell>
                      <Typography variant="h5" component="h3" gutterBottom>
                        Years of Experience:
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1">
                        {userData.years_of_experience}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="h5" component="h3" gutterBottom>
                        Hourly Rate:
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1">
                        {userData.hourly_rate}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
            <Button
              variant="contained"
              color="primary"
              onClick={toggleEditMode}
              sx={{ mt: 2 }}
            >
              Edit
            </Button>
          </Box>
        ) : (
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              type="file"
              accept=".jpg,.png,.jpeg"
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
            {userData.user_type === "walker" && (
              <>
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
              </>
            )}
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
            <Button variant="outlined" color="primary" onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
        )}

        {/* Vaccination Table */}
        {userData.dogs && (
          <Box
            sx={{ backgroundColor: "white", mt: 4, p: 2, borderRadius: "10px" }}
          >
            {userData.dogs && userData.dogs.length === 0 && (
              <Typography variant="h4">
                Add your dogs to see their vaccinations here
              </Typography>
            )}
            <Button
              variant="contained"
              onClick={() => setAddingDog(!addingDog)}
            >
              Add Dog
            </Button>
            <br></br>
            {addingDog && (
              <AddDog
                close={() => {
                  setAddingDog(false);
                }}
              />
            )}
            {userData.dogs &&
              userData.dogs.length !== 0 &&
              vaccinationData &&
              vaccinationData.map((dogVacs, index) => (
                <>
                  <Typography
                    variant="h4"
                    component="h2"
                    gutterBottom
                    style={{ marginTop: 20 }}
                  >
                    {dogVacs.name}'s Vaccination Table
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setShowVacTable((prevArray) => {
                        const newArray = [...prevArray];
                        newArray[index] = !prevArray[index];
                        return newArray;
                      });
                    }}
                  >
                    Show Table
                  </Button>

                  {/* here */}
                  {showVacTable[index] && (
                    <TableContainer component={Paper} style={{ marginTop: 10 }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Vaccine Name</TableCell>
                            <TableCell>Next Due Date</TableCell>
                            <TableCell>status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Object.entries(dogVacs.vacs).map(([key, value]) => (
                            <TableRow>
                              <TableCell>{value.vaccine}</TableCell>
                              <TableCell>{value.date}</TableCell>
                              <TableCell>{value.status}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </>
              ))}
          </Box>
        )}
      </Box>
    </Container>
  );

};

export default Profile;