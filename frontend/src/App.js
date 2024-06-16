// src/App.js
import React, { useState } from "react";
import DogWalkerProfile from "/DogWalkerProfile";

const App = () => {
  const [currentDogWalker, setCurrentDogWalker] = useState({
    username: "JohnDoe",
    coordinates: [40.7128, -74.0060],
    name: "John Doe",
    years_of_experience: 5,
    hourly_rate: 20,
    phone_number: "0123456789",
    rating: 4.5,
  });

  return (
    <div className="App">
      <DogWalkerProfile
        dogWalker={currentDogWalker}
        setCurrentDogWalker={setCurrentDogWalker}
      />
    </div>
  );
};

export default App;
