import { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography } from '@mui/material';

const AddressSearchBar = ({setLocation}) => {
    const [address, setAddress] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    const handleSearch = async () => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${address}&format=json`);
            console.log(response.data);
            if (response.data.length > 0) {
                const { lat, lon } = response.data[0];
                console.log(lat,lon);
                setLocation({lat: parseFloat(lat), lng: parseFloat(lon)});
            } else {
                // Handle no results found
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          handleSearch();
        }
      };

    return (
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Enter address"
            variant="outlined"
            fullWidth
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleSearch} >
            Search
          </Button>
          {latitude && longitude && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              Latitude: {latitude}, Longitude: {longitude}
            </Typography>
          )}
        </Box>
      );
};

export default AddressSearchBar;
