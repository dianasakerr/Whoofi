import { Route, Routes } from "react-router-dom";
import HomePage from './HomePage'; // Import the home page component
import Login from './Login';
import SignupProcess from './SignupProcess';
import DogWalkersSearchPage from './DogWalkersSearchPage';
import Header from './Header';
import OpeningPage from './OpeningPage';

const WindowSetter = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupProcess />} />
        <Route path="/search" element={<DogWalkersSearchPage />} />
      </Routes>
    </div>
  );
};

export default WindowSetter;
