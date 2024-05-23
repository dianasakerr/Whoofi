import React, { useState, useEffect } from 'react';
import './styles/styles.css'; // Import your CSS styles
import woofiLogo from './logosAndIcons/woofiLogo.jpeg'
import backArrow from './logosAndIcons/back-arrow.svg'
import whatsappLogo from './logosAndIcons/whatsapp logo.png'
import axios from 'axios';



const DogWalkerProfile = ({dogWalker, setCurrentDogWalker}) => {
  const [address, setAddress] = useState("");

  const resetDogWalker = () => setCurrentDogWalker(null)


  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      response.json().then(data => {
        setAddress(data.address);
      })
    } catch (error) {
      setAddress('Address not found');
    }
  };

  useEffect(() => {
    reverseGeocode(...dogWalker.coordinates);
    console.log(dogWalker);
  },[]);

  const gotoWhatsap = () => {
    const internetional = "+972"+ dogWalker.phone_number.replace(/^0/, '');
    window.open("https://wa.me/" + internetional);
  }

  return (
    <div className="container">
      {!dogWalker && <p>Dog walker not found</p>}
      <h1>Dog Walker Profile</h1>
      {dogWalker && 
      <div className="profile">
        <img src={woofiLogo} alt={dogWalker.name} className='profile-image' height="300" width="300"/>
        <div className="details">
          <h2>{dogWalker.username}</h2>
          <p>Location: {address.city || address.town}, {address.road} {address.house_number}</p>
          <p>Experience: {dogWalker.years_of_experience} years</p>
          <p>Price: ${dogWalker.hourly_rate} per hour</p>
          <p>Phone: {dogWalker.phone_number} <img src={whatsappLogo} alt="" onClick={gotoWhatsap} height="30" width="30"/></p>
          <p>Rating: {dogWalker.rating}</p>
        </div>
      </div>}
      <img src={backArrow} alt="" className="src" onClick={resetDogWalker} height="30" width="30"/>
    </div>
  );
};

export default DogWalkerProfile;
