import React, { useState, useEffect } from 'react';
import fakeDogWalkers from './FakeData';
import DogWalkerProfile from './DogWalkerProfile';
import './styles.css';

const DogWalkersSearchPage = () => {
  // State to store dog walker profiles
  const dogWalkers = fakeDogWalkers;
  const [currentDogWalker, setCurrentDogWalker] = useState(-1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('name'); 

  // Function to calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

  const handleProfileClick = (walkerId) => {
    setCurrentDogWalker(walkerId);
  };

  const renderExperiencePaws = (experience) => {
    return (
      <div className="paw-container">
        {[...Array(experience)].map((_, index) => (
          <img src="./logosAndIcons/dogPaw.svg" alt="Paw" className="paw-img" />
        ))}
      </div>
    );
  };

  const filteredDogWalkers = dogWalkers.filter(walker => {
    switch (searchCriteria) {
      case 'name':
        return walker.name.toLowerCase().includes(searchTerm.toLowerCase());
      case 'location':
        return walker.location.toLowerCase().includes(searchTerm.toLowerCase());
      case 'experience':
        return walker.experience.toString().includes(searchTerm);
      default:
        return true;
    }
  });




  return (
    <>
    {currentDogWalker >= 0 && <DogWalkerProfile id={currentDogWalker} setCurrentDogWalker={setCurrentDogWalker}/>}
    {currentDogWalker <  0 && 
    <div className="container">
      <h1>Dog Walkers Search</h1>
      <div className="search-options">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <select
          value={searchCriteria}
          onChange={(e) => setSearchCriteria(e.target.value)}
          className="search-criteria"
        >
          <option value="name">Name</option>
          <option value="location">Location</option>
          <option value="experience">Experience</option>
        </select>
      </div>
      <div className="dog-walker-list">
        {filteredDogWalkers.map(dogWalker => (
          <div key={dogWalker.id} className="dog-walker-card" onClick={() => handleProfileClick(dogWalker.id)}>
            <div className="details">
              <h2>{dogWalker.name}</h2>
              <p>{dogWalker.location}</p>
              <p>Age: {calculateAge(dogWalker.dateOfBirth)}</p>
              <div className="experience">
                <p>Experience:</p>
                {renderExperiencePaws(dogWalker.experience)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  }
  </>
  );
};

export default DogWalkersSearchPage;