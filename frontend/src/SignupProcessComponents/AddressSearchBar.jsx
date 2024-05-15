import { useState } from 'react';
import axios from 'axios';

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

    return (
        <div>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
            <button onClick={handleSearch}>Search</button>
            {latitude && longitude && (
                <p>Latitude: {latitude}, Longitude: {longitude}</p>
            )}
        </div>
    );
};

export default AddressSearchBar;
