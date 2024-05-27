import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import AddressSearchBar from './AddressSearchBar';
import 'leaflet/dist/leaflet.css';
import { Box, Button, Container } from '@mui/material';

function LocationMarker({ setLocation }) {
  const map = useMapEvents({
    click(e) {
      setLocation(e.latlng);
    },
  });
  
  return null;
}

function LocationInputMap({ setFinalLocation, curLocation }) {
  const [map, setMap] = useState(null);
  const [location, setLocation] = useState(null);
  const defaultLocation = { lat: 32.077976, lng: 34.774220} // set to TLV's dizingof squere

  useEffect(() => {
    setLocation(curLocation);
  },[]);

  useEffect(() => {
    if (map && location) {
        map.setView([location.lat,location.lng]);
    }
    else {
      console.log(map,location);
    }
}, [map, location]);

return (
  <Container component="main" maxWidth="md">
    <Box sx={{ mt: 4, mb: 2 }}>
      <AddressSearchBar setLocation={setLocation} />
    </Box>
    <MapContainer
      center={location ? [location.lat, location.lng] : [defaultLocation.lat, defaultLocation.lng]}
      zoom={13}
      style={{ height: '400px', width: '100%' }}
      whenCreated={(map) => setMap(map)}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {location && <Marker position={location} />}
      <LocationMarker setLocation={setLocation} />
    </MapContainer>
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
      <Button variant="contained" color="primary" onClick={() => setFinalLocation(location)}>
        Confirm Manual Choice
      </Button>
    </Box>
  </Container>
);
}

export default LocationInputMap;