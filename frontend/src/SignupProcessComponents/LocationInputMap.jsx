import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function LocationMarker({ setLocation }) {
  const map = useMapEvents({
    click(e) {
      setLocation(e.latlng);
    },
  });
  
  return null;
}

function LocationInputMap({ location, setLocation }) {
  const [map, setMap] = useState(null);

  const defaultLocation = { lat: 32.109333, lng: 34.855499} // set to TLV

  useEffect(() => {
    if (map && location) {
        map.setView([location.lat,location.lng]);
    }
    else {
      console.log(map,location);
    }
}, [map, location]);

  return (
    <MapContainer center={[location.lat, location.lng] ? location : [defaultLocation.lat,defaultLocation.lng]} zoom={13} style={{ height: '400px', width: '100%' }} ref={setMap}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {location && <Marker position={location} />}
      <LocationMarker setLocation={setLocation} />
    </MapContainer>
  );
}

export default LocationInputMap;