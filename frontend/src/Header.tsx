import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const nav = useNavigate();

  const checkLocalStorage = () => {
    const item = localStorage.getItem("token");
    setIsSignedIn(!!item);
  };

  useEffect(() => {
    checkLocalStorage();

    const handleStorageChange = () => {
      console.log("Storage change heard from header");
      checkLocalStorage();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("mngr");
    setIsSignedIn(false);
    nav('/');
    window.dispatchEvent(new Event("storage"));
  };

  return (
<<<<<<< HEAD
    <AppBar position="sticky">
      <Toolbar>
        <Box display="flex" justifyContent="space-between" width={"100vw"}>
          <Button color="inherit" component={Link} to="/DogWalkerProfile">
            My Profile
          </Button>
          <Button color="inherit" component={Link} to="/">
            Home Page
          </Button>
          {isSignedIn ? (
            <>
              <Button color="inherit" component={Link} to="/profile">
                My Profile
              </Button>
              <Button color="inherit" onClick={handleSignOut}>
                Exit
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Sign in
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Sign Up
              </Button>
            </>
          )}
          <Button color="inherit" component={Link} to="/search">
            Look for a Dog Walker
          </Button>
          <Button color="inherit" component={Link} to="/barkingDetecter">
            Dog Bark Detector
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
=======
    <header className="header">
      <Logo />
      <nav className="navbar">
        <ul className="nav-list">
          <li><Link to="/profile" className="nav-link">My Profile</Link></li>
          <li><Link to="/Login" className="nav-link">Login</Link></li>
          <li><Link to="/" className="nav-link">Home Page</Link></li>
          <li><Link to="/search" className="nav-link">Look for a Dog Walker</Link></li>
          <li><a href="#" className="nav-link" onClick={() => { /* Handle Exit */ }}>Exit</a></li>
        </ul>
      </nav>
    </header>
>>>>>>> 2a7eae9 (Login btn going to the searchdogwalker pag)
  );
};

export default Header;
