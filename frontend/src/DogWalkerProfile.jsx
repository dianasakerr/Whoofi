import React, { useState, useEffect } from 'react';
import './styles/styles.css'; // Import your CSS styles
import woofiLogo from './logosAndIcons/woofiLogo.jpeg'
import backArrow from './logosAndIcons/back-arrow.svg'



const DogWalkerProfile = ({dogWalker, setCurrentDogWalker}) => {

  const resetDogWalker = () => setCurrentDogWalker(null)

  return (
    <div className="container">
      {!dogWalker && <p>Dog walker not found</p>}
      <h1>Dog Walker Profile</h1>
      {dogWalker && 
      <div className="profile">
        <img src={woofiLogo} alt={dogWalker.name} className='profile-image' height="300" width="300"/>
        <div className="details">
          <h2>{dogWalker.username}</h2>
          <p>Location: {}</p>
          <p>Experience: {dogWalker.experience} years</p>
          <p>Price: ${dogWalker.price} per hour</p>
          <p>Phone: {dogWalker.phoneNumber}</p>
          <p>Rating: {dogWalker.rating}</p>
        </div>
      </div>}
      <img src={backArrow} alt="" className="src" onClick={resetDogWalker} height="30" width="30"/>
    </div>
    
  );
};

export default DogWalkerProfile;
