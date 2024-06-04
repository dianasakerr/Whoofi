import { useState, useEffect } from 'react'
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';
import LocationInputMap from './LocationInputMap';
import axios from 'axios';
import { Box, Button, Typography, Container, Alert } from '@mui/material';

const SetLocation = ({setFinalLocation,setFinalAddress, onBack}) => {
    const [address, setAddress] = useState("");
    const [error, setError] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [location, setLocation] = useState(null);

    // for automatic device location
    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setLocation({lat: position.coords.latitude, lng: position.coords.longitude});
              },
              (error) => {
                setError(error.message);
              }
            );
          } else {
            setError('Geolocation is not supported by this browser.');
          }
        };


        const reverseGeocode = async (lat, lng) => {
          try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const { display_name } = response.data;
            setAddress(display_name);
          } catch (error) {
            setAddress('Address not found');
          }
        };
      
    useEffect(() => {
      getLocation();
    },[]);

    useEffect(() => {
      if (location) {
      reverseGeocode(location.lat,location.lng);
    }
    },[location])

    return (
      <Container component="main" maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Button variant="contained" onClick={() => setShowMap(!showMap)}>
              Enter Location Manually
            </Button>
            <Button variant="outlined" onClick={onBack}>
              Back
            </Button>
          </Box>
  
          {showMap && (
            <LocationInputMap setFinalLocation={setLocation} curLocation={location} />
          )}
  
          {location && (
            <>
              <Typography variant="body1" sx={{ mt: 2 }}>
                {address || 'Address not found'}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setFinalLocation(location);
                    setFinalAddress(address);
                  }}
                >
                  Confirm Location
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Container>
    );

}
export default SetLocation