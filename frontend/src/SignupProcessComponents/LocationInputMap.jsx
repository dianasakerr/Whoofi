import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import AddressSearchBar from './AddressSearchBar';
import 'leaflet/dist/leaflet.css';

function LocationMarker({ setLocation }) {
  const map = useMapEvents({
    click(e) {
      setLocation(e.latlng);
    },
  });
  
  return null;
}

function LocationInputMap({ setFinalLocation }) {
  const [map, setMap] = useState(null);
  const [location, setLocation] = useState(null);
  const defaultLocation = { lat: 32.077976, lng: 34.774220} // set to TLV's dizingof squere

  

  useEffect(() => {
    if (map && location) {
        map.setView([location.lat,location.lng]);
    }
    else {
      console.log(map,location);
    }
}, [map, location]);

  return (
    <>
    <AddressSearchBar setLocation={setLocation}/>
    <MapContainer center={location ? [location.lat, location.lng] : [defaultLocation.lat,defaultLocation.lng]} zoom={13} style={{ height: '400px', width: '100%' }} ref={setMap}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {location && <Marker position={location} />}
      <LocationMarker setLocation={setLocation} />
    </MapContainer>
    </>

  );
}

export default LocationInputMap;