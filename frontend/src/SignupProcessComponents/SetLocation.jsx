import { useState, useEffect } from 'react'
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';
import LocationInputMap from './LocationInputMap';
import axios from 'axios';

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
    <>
    <button onClick={() => setShowMap(!showMap)}>enter location manualy</button>
    <button onClick={onBack}>back</button>

    { showMap &&
    <>
    <LocationInputMap setFinalLocation={setLocation} curLocation={location}/>
    </>
    }
    {location && 
    <>
      {address && <div>{address}</div>}
      <button onClick={() => {setFinalLocation(location); setFinalAddress(address);}}>Confirm location</button>
    </>
    }

    </>
)

}
export default SetLocation