import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isSignedIn, setIsSignedIn] = useState(false); // Corrected initialization of useState
  const [userType, setUserType] = useState<string | null>(null); // Corrected initialization of useState
  const nav = useNavigate();

  const checkLocalStorage = () => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType"); // Assume the user type is stored in local storage
    setIsSignedIn(!!token);
    setUserType(userType);
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

  useEffect(() => {
    // Debugging userType
    console.log("userType in Header:", userType);
  }, [userType]);

  const handleSignOut = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userType"); // Ensure to remove userType on sign out
  localStorage.removeItem("mngr"); // Ensure to remove manager type on sign out
  setIsSignedIn(false);
  setUserType(null);
  nav('/');
  window.dispatchEvent(new Event("storage"));
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Box display="flex" justifyContent="space-between" width={"100vw"}>
          <Button color="inherit" component={Link} to="/">
            Home Page
          </Button>
          {isSignedIn ? (
            <>
              {userType === "walker" ? (
                <Button color="inherit" component={Link} to="/dogWalkerProfile">
                  Dog Walker Profile
                </Button>
              ) : (
                <Button color="inherit" component={Link} to="/profile">
                  My Profile
                </Button>
              )}
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
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
