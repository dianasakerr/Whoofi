import { Route, Routes, useNavigate } from "react-router-dom";
import HomePage from './HomePage'; // Import the home page component
import Login from './Login';
import SignupProcess from './SignupProcess';
import DogWalkersSearchPage from './DogWalkersSearchPage';
import Header from './Header';
import Profile from "./Profile";
import { useEffect, useState } from "react";
import { Fab } from "@mui/material";
import Admin from "./Admin";


const WindowSetter = () => {
  const [admin, setAdmin] = useState<boolean>(false);
  const nav = useNavigate();

  const handleStorageChange = () => {
    const mngr_type = localStorage.getItem('mngr');
    setAdmin(mngr_type === "manager")
  }

  const toAdmin = () => {
    nav("/Admin")
  }

  useEffect(() => {
    window.addEventListener('storage', handleStorageChange);
  },[])

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
        <Route path="/Admin" element={<Admin/>}></Route>
      </Routes>
      {admin && 
      <Fab color="primary" sx={{position: 'fixed',bottom:20,right:20, p:7}} onClick={toAdmin}>Manage users</Fab>}
    </div>
  );
};

export default WindowSetter;
