import React, { useState, useEffect } from 'react';
import DogWalkerProfile from './DogWalkerProfile';
import dogPaw from './logosAndIcons/dogPaw.svg';
import './styles/DogWalkersSearchPage.css';

const DogWalkersSearchPage = () => {
  // State to store dog walker profiles
  const [dogWalkers,setDogWalkers] = useState([]);
  const [currentDogWalker, setCurrentDogWalker] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('name'); 
  const [distanceFilter, setDistanceFilter] = useState(50);
  const [sizeFilter, setSizeFilter] = useState({
    small: true,
    mid: true,
    big: true
  });

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + 'get_dog_walkers/?')
    .then(
      res => {
        if (!res.ok) {
          throw new Error('Failed to fetch dogwalkers');
        }
        return res.json();
      }).then(data => {
        setDogWalkers(data);
      }).catch(err => console.log(err))
  },[])

  // fetch dog walkers from API
  const handleFilter = () => {
    console.log(localStorage.getItem('token'),localStorage.getItem('userType'))
    fetch(import.meta.env.VITE_API_URL + "get_user/?" + new URLSearchParams({
      email: localStorage.getItem('token'),
      user_type: localStorage.getItem('userType')
    })).then(res => {
      res.json().then((body) => {
        return body.coordinates;
      }).then((myCoordinates) => fetch(import.meta.env.VITE_API_URL + 'get_dog_walkers/?' + new URLSearchParams({
        location_radius_km: distanceFilter,
        small: sizeFilter.small,
        mid: sizeFilter.mid,
        big: sizeFilter.big,
        longitude: myCoordinates[0],
        latitude: myCoordinates[1]
      })).then(
        res => {
          if (!res.ok) {
            throw new Error('Failed to fetch dogwalkers');
          }
  
          return res.json();
        }).then(data => {
          setDogWalkers(data);
        }).catch(err => console.log(err)))
      }
    )
  }

  const handleProfileClick = (walker) => {
    setCurrentDogWalker(walker);
  };

  const renderExperiencePaws = (experience) => {
    return (
      <div className="paw-container">
        {[...Array(experience)].map((_, index) => (
          <img key={index} src={dogPaw} alt="Paw" className="paw-img" />
        ))}
      </div>
    );
  };

  const handleDistanceChange = (event) => {
    setTimeout(() => setDistanceFilter(event.target.value), 30);
  };

  const handleSizeCheck = (event) => {
    const { value, checked } = event.target;
    setSizeFilter((prevCheckboxes) => ({
      ...prevCheckboxes,
      [value]: checked,
    }));
  };

  return (
    <>
    {currentDogWalker && <DogWalkerProfile dogWalker={currentDogWalker} setCurrentDogWalker={setCurrentDogWalker}/>}
    {!currentDogWalker && 
    <div className="container">
      <h1>Dog Walkers Search</h1>

      <div className="search-filter">
        <h3>filter search</h3>
        <label> dog walkers in a {distanceFilter}Km radius near your
        <br/>
        <input type="range" min="0" max="150" onChange={handleDistanceChange}/>
        </label>

        <p>dog walkers accepting dogs in sizes:</p>
        <label>big
          <input type="checkbox" value="big" onChange={handleSizeCheck}></input>
        </label>
        <label>medium
          <input type="checkbox" value="mid" onChange={handleSizeCheck}></input>
        </label>

        <label>small
          <input type="checkbox" value="small" onChange={handleSizeCheck}></input>
        </label>
        <br/>
      <button onClick={handleFilter}>filter</button>
    </div>
      
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