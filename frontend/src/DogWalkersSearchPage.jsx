import React, { useState, useEffect } from 'react';
import DogWalkerProfile from './DogWalkerProfile';
import './styles/styles.css';

const DogWalkersSearchPage = () => {
  // State to store dog walker profiles
  const [dogWalkers,setDogWalkers] = useState([]);
  const [currentDogWalker, setCurrentDogWalker] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('name'); 

  // fetch dog walkers from API
  useEffect(() => {
    fetch('http://localhost:8000/get_dog_walkers/').then(
      res => {
        if (!res.ok) {
          throw new Error('Failed to fetch dogwalkers');
        }

        return res.json();
      }).then(data => {
        console.log('fetched: ', data, "type: " ,typeof(data));
        setDogWalkers(data);
      }).catch(err => console.log(err))
  },[]);

  const handleProfileClick = (walker) => {
    setCurrentDogWalker(walker);
  };

  const renderExperiencePaws = (experience) => {
    return (
      <div className="paw-container">
        {[...Array(experience)].map((_, index) => (
          <img key={index} src="./logosAndIcons/dogPaw.svg" alt="Paw" className="paw-img" />
        ))}
      </div>
    );
  };

  return (
    <>
    {currentDogWalker && <DogWalkerProfile dogWalker={currentDogWalker} setCurrentDogWalker={setCurrentDogWalker}/>}
    {!currentDogWalker && 
    <div className="container">
      <h1>Dog Walkers Search</h1>
      
      <div className="dog-walker-list">
        {dogWalkers ? dogWalkers.map(dogWalker => (
          <div key={dogWalker.id} className="dog-walker-card" onClick={() => handleProfileClick(dogWalker)}>
            <div className="details">
              <h2>{dogWalker.username}</h2>
              <p>{dogWalker.location}</p>
              <p>Age: {dogWalker.age}</p>
              <div className="experience">
                <p>Experience:</p>
                {renderExperiencePaws(dogWalker.experience)}
              </div>
            </div>
          </div>
        )) : <p>No dogwalkers in whoofi's system</p>}
      </div>
    </div>
  }
  </>
  );
};

export default DogWalkersSearchPage;