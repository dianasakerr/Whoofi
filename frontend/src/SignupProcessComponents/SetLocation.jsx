import { useState, useEffect } from 'react'
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';
import LocationInputMap from './LocationInputMap';


const SetLocation = ({setFinalLocation}) => {
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
              },
              (error) => {
                setError(error.message);
              }
            );
          } else {
            setError('Geolocation is not supported by this browser.');
          }
        };
    
    
    

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
    </>
)

}
export default SetLocation