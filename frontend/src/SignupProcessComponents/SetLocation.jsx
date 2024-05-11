import { useState, useEffect } from 'react'
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';
import LocationInputMap from './LocationInputMap';
import axios from 'axios';



const SetLocation = ({setFinalLocation}) => {
    const [address, setAddress] = useState("");
    const [error, setError] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [location, setLocation] = useState(null);

    // for automatic device location
    const getLocation = () => {
      console.log()
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setLocation({lat: position.coords.latitude, lng: position.coords.longitude});
                console.log(location);
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
            console.log(display_name);
      
          } catch (error) {
            console.error('Error fetching address:', error);
            setAddress('Address not found');
          }
        };
      
    
    useEffect(() => {
      if (location) {
      reverseGeocode(location.lat,location.lng);
    }
    },[location])

  return (
    <>
    <button onClick={getLocation}>get my location</button>
    <button onClick={() => setShowMap(!showMap)}>enter location manualy</button>
    { showMap &&
    <>
    <LocationInputMap setFinalLocation={setLocation}/>
    </>
    }
    {location && 
    <>
    <h3>lat: {location.lat.toFixed(4)} long: {location.lng.toFixed(4)} </h3>
    <button onClick={() => setFinalLocation(location)}>Confirm location</button>
    </>
    }

    {address && <div>{address}</div>
    }
    </>
)

}
export default SetLocation