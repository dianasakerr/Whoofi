import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import L from 'leaflet';
import 'leaflet-control-geocoder';


const SetLocation = () => {
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [error, setError] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
  
    const [position, setPosition] = useState([51.505, -0.09]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleMapClick = (e) => {
    setPosition(e.latlng);
  };

  const handleSearch = () => {
    const geocoder = L.Control.Geocoder.nominatim();
    geocoder.geocode(searchQuery, (results) => {
      if (results && results.length > 0) {
        const latlng = [results[0].center.lat, results[0].center.lng];
        setPosition(latlng);
      }
    });
  };

    // for automatic device location
    const getLocation = () => {
      console.log()
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
              },
              (error) => {
                setError(error.message);
              }
            );
          } else {
            setError('Geolocation is not supported by this browser.');
          }
        };
    
    const tel_aviv_position = { lat: 32.109333, lng: 34.855499}
    

  return (
    <>
    <button onClick={getLocation}>get my location</button>
    <button onClick={() => setShowMap(!showMap)}>enter location manualy</button>
    { showMap &&
    <>
      <h1>map</h1>
      <div style={{ height: '600px' }}>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Search location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <Map center={position} zoom={13} onClick={handleMapClick}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>Your location</Popup>
        </Marker>
      </Map>
    </div>
    </>
    }
    </>
)

}
export default SetLocation