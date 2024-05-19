import { Route, Routes } from "react-router-dom";
import HomePage from './HomePage'; // Import the home page component
import Login from './Login';
import SignupProcess from './SignupProcess';
import DogWalkersSearchPage from './DogWalkersSearchPage';
import Header from './Header';
import Profile from "./Profile";

const WindowSetter = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupProcess />} />
        <Route path="/search" element={<DogWalkersSearchPage />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
};

export default WindowSetter;
