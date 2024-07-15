// DogWalkersSearchPage.jsx

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Card,
  Collapse,
  CardContent,
  Typography,
  Slider,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Rating,
} from "@mui/material";
import DogWalkerProfile from "./DogWalkerProfile";
import dogPaw from "./logosAndIcons/dogPaw.svg";
import "./styles/DogWalkersSearchPage.css";

const DogWalkersSearchPage = () => {
  const [dogWalkers, setDogWalkers] = useState([]);
  const [currentDogWalker, setCurrentDogWalker] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("name");
  const [distanceFilter, setDistanceFilter] = useState(25);
  const [sizeFilter, setSizeFilter] = useState({
    small: true,
    mid: true,
    big: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const checkLogIn = () => {
    setIsLoggedIn(localStorage.getItem("token") !== null);
  };

  useEffect(() => {
    fetchDogWalkers();
    if (localStorage.getItem("token") !== null) {
      setIsLoggedIn(true);
    }

    window.addEventListener("storage", checkLogIn);

    return () => {
      window.removeEventListener("storage", checkLogIn);
    };
  }, []);

  const fetchDogWalkers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}get_dog_walkers/?token=` +
          localStorage.getItem("token")
      );
      if (!response.ok) throw new Error("Failed to fetch dog walkers");
      const data = await response.json();
      setDogWalkers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}get_user/?token=` +
          localStorage.getItem("token")
      );
      if (!response.ok) throw new Error("Failed to fetch user");
      const user = await response.json();
      const myCoordinates = user.coordinates;
      const filterResponse = await fetch(
        `${import.meta.env.VITE_API_URL}get_dog_walkers/?` +
          new URLSearchParams({
            token: localStorage.getItem("token"),
            location_radius_km: distanceFilter,
            small: sizeFilter.small,
            mid: sizeFilter.mid,
            big: sizeFilter.big,
            longitude: myCoordinates[0],
            latitude: myCoordinates[1],
          })
      );
      if (!filterResponse.ok) throw new Error("Failed to fetch dog walkers");
      const data = await filterResponse.json();
      setDogWalkers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = (walker) => {
    setCurrentDogWalker(walker);
  };

  const renderExperiencePaws = (experience) => (
    <Box className="paw-container">
      {[...Array(experience)].map((_, index) => (
        <img key={index} src={dogPaw} alt="Paw" className="paw-img" />
      ))}
    </Box>
  );

  const handleDistanceChange = (event, newValue) => {
    setDistanceFilter(newValue);
  };

  const handleSizeCheck = (event) => {
    const { value, checked } = event.target;
    setSizeFilter((prev) => ({
      ...prev,
      [value]: checked,
    }));
  };

  return (
    <>
      {currentDogWalker ? (
        <DogWalkerProfile
          dogWalker={currentDogWalker}
          setCurrentDogWalker={setCurrentDogWalker}
        />
      ) : (
        <Container className="container">
          <Typography variant="h4" component="h1" mt={2} gutterBottom>
            Dog Walkers Search
          </Typography>

          <Box className="search-filter" mb={4}>
            <Button onClick={() => setIsFiltering(!isFiltering)}>
              Filter Search
            </Button>
            <Collapse in={isFiltering}>
              <Typography>
                Dog walkers in a {distanceFilter} km radius near you
              </Typography>
              <Slider
                value={distanceFilter}
                onChange={handleDistanceChange}
                aria-labelledby="distance-slider"
                min={0}
                max={80}
                valueLabelDisplay="auto"
              />
              <Typography>Dog walkers accepting dogs in sizes:</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sizeFilter.big}
                    onChange={handleSizeCheck}
                    value="big"
                  />
                }
                label="Big"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sizeFilter.mid}
                    onChange={handleSizeCheck}
                    value="mid"
                  />
                }
                label="Medium"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sizeFilter.small}
                    onChange={handleSizeCheck}
                    value="small"
                  />
                }
                label="Small"
              />
              <br />
              <Button
                disabled={!isLoggedIn}
                variant="contained"
                color="primary"
                onClick={handleFilter}
              >
                {isLoggedIn
                  ? "Filter"
                  : "Sign in or Sign up to filter dog walkers search"}
              </Button>
            </Collapse>
          </Box>

          {loading && <CircularProgress />}
          {error && <Typography color="error">{error}</Typography>}

          <div className="dog-walker-list">
            {dogWalkers.map((dogWalker, index) => (
              <div key={index} className="dog-walker-card" onClick={() => handleProfileClick(dogWalker)}>
                <CardContent>
                  <Typography variant="h6">{dogWalker.username}</Typography>
                  <Typography>{dogWalker.location}</Typography>
                  <Box className="experience">
                    <Typography>
                      Experience: {dogWalker.years_of_experience} years
                    </Typography>
                    <Typography>
                      <Rating
                        readOnly
                        defaultValue={dogWalker.avg_rate}
                        precision={0.25}
                      />
                    </Typography>
                  </Box>
                </CardContent>
              </div>
            ))}
          </div>
        </Container>
      )}
    </>
  );
};

export default DogWalkersSearchPage;
