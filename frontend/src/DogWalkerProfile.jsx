import React, { useState, useEffect } from 'react';
import fakeDogWalkers from './FakeData';
import './styles.css'; // Import your CSS styles


const DogWalkerProfile = ({id, setCurrentDogWalker}) => {
  const [dogWalker, setDogWalker] = useState(null); // State to store the dog walker profile

  // Effect to fetch the dog walker profile when the component mounts
  useEffect(() => {
    // Find the dog walker with the matching id
    const foundDogWalker = fakeDogWalkers.find(walker => walker.id === id);
    // Set the dog walker state
    setDogWalker(foundDogWalker);
  }, []); // Run the effect whenever the id parameter changes

  const resetDogWalker = () => setCurrentDogWalker(-1)

  return (
    <div className="container">
      {!dogWalker && <p>Dog walker not found</p>}
      <h1>Dog Walker Profile</h1>
      {dogWalker && 
      <div className="profile">
        <img src={dogWalker.photo} alt={dogWalker.name} className="profile-img" height="300" width="300"/>
        <div className="details">
          <h2>{dogWalker.name}</h2>
          <p>Location: {dogWalker.location}</p>
          <p>Experience: {dogWalker.experience} years</p>
          <p>Price: ${dogWalker.price} per hour</p>
          <p>Phone: {dogWalker.phoneNumber}</p>
          <p>Rating: {dogWalker.rating}</p>
        </div>
      </div>}
      <img src="./logosAndIcons/back-arrow.svg" alt="" className="src" onClick={resetDogWalker} height="30" width="30"/>
    </div>
    
  );
};

export default DogWalkerProfile;
