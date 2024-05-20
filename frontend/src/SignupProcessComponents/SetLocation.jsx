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
      console.log()
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setLocation([position.coords.latitude, position.coords.longitude]);
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
      if (location) {
      reverseGeocode(location[0],location[1]);
    }
    },[location])

  return (
    <>
    <button onClick={getLocation}>get my location</button>
    <button onClick={() => setShowMap(!showMap)}>enter location manualy</button>
    <button onClick={onBack}>back</button>

    { showMap &&
    <>
    <LocationInputMap setFinalLocation={setLocation}/>
    </>
    }
    {location && 
    <>
    <h3>lat: {location[0].toFixed(4)} long: {location[0].toFixed(4)} </h3>
    <button onClick={() => {setFinalLocation(location); setFinalAddress(address);}}>Confirm location</button>
    </>
    }

    {address && <div>{address}</div>
    }
    </>
)

}
export default SetLocation